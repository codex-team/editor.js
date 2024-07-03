/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import * as _ from '../../utils';
import { InlineTool as IInlineTool } from '../../../../types';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';
import { ModuleConfig } from '../../../types-internal/module-config';
import { CommonInternalSettings } from '../../tools/base';
import { Popover, PopoverItemHtmlParams, PopoverItemParams, PopoverItemType, WithChildren } from '../../utils/popover';
import { PopoverInline } from '../../utils/popover/popover-inline';

/**
 * Inline Toolbar elements
 */
interface InlineToolbarNodes {
  wrapper: HTMLElement | undefined;
}

/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 * |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
 * |   B  i [link] [mark]   |
 * |________________________|
 */
export default class InlineToolbar extends Module<InlineToolbarNodes> {
  /**
   * CSS styles
   */
  public CSS = {
    inlineToolbar: 'ce-inline-toolbar',
  };

  /**
   * State of inline toolbar
   */
  public opened = false;

  /**
   * Popover instance reference
   */
  private popover: Popover | null = null;

  /**
   * Margin above/below the Toolbar
   */
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private readonly toolbarVerticalMargin: number = _.isMobileScreen() ? 20 : 6;

  /**
   * Currently visible tools instances
   */
  private toolsInstances: Map<string, IInlineTool> | null = new Map();

  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });
  }

  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      window.requestIdleCallback(() => {
        this.make();
      }, { timeout: 2000 });
    } else {
      this.destroy();
    }
  }

  /**
   *  Moving / appearance
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Shows Inline Toolbar if something is selected
   *
   * @param [needToClose] - pass true to close toolbar if it is not allowed.
   *                                  Avoid to use it just for closing IT, better call .close() clearly.
   */
  public async tryToShow(needToClose = false): Promise<void> {
    if (needToClose) {
      this.close();
    }

    if (!this.allowedToShow()) {
      return;
    }

    await this.open();

    this.Editor.Toolbar.close();
  }

  /**
   * Hides Inline Toolbar
   */
  public close(): void {
    if (!this.opened) {
      return;
    }

    if (this.Editor.ReadOnly.isEnabled) {
      return;
    }

    Array.from(this.toolsInstances.entries()).forEach(([name, toolInstance]) => {
      const shortcut = this.getToolShortcut(name);

      if (shortcut) {
        Shortcuts.remove(this.Editor.UI.nodes.redactor, shortcut);
      }

      /**
       * @todo replace 'clear' with 'destroy'
       */
      if (_.isFunction(toolInstance.clear)) {
        toolInstance.clear();
      }
    });

    this.toolsInstances = null;

    this.reset();
    this.opened = false;

    this.popover?.hide();
    this.popover?.destroy();
    this.popover = null;
  }

  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to check
   */
  public containsNode(node: Node): boolean {
    if (this.nodes.wrapper === undefined) {
      return false;
    }

    return this.nodes.wrapper.contains(node);
  }

  /**
   * Removes UI and its components
   */
  public destroy(): void {
    this.removeAllNodes();
    this.popover?.destroy();
    this.popover = null;
  }

  /**
   * Making DOM
   */
  private make(): void {
    this.nodes.wrapper = $.make('div', [
      this.CSS.inlineToolbar,
      ...(this.isRtl ? [ this.Editor.UI.CSS.editorRtlFix ] : []),
    ]);

    if (import.meta.env.MODE === 'test') {
      this.nodes.wrapper.setAttribute('data-cy', 'inline-toolbar');
    }

    /**
     * Append the inline toolbar to the editor.
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Shows Inline Toolbar
   */
  private async open(): Promise<void> {
    if (this.opened) {
      return;
    }

    /**
     * Show Inline Toolbar
     */

    this.opened = true;

    if (this.popover !== null) {
      this.popover.destroy();
    }

    const inlineTools = await this.getInlineTools();

    this.popover = new PopoverInline({
      items: inlineTools,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    });

    this.move(this.popover.size.width);

    this.nodes.wrapper?.append(this.popover.getElement());

    this.popover.show();
  }

  /**
   * Move Toolbar to the selected text
   *
   * @param popoverWidth - width of the toolbar popover
   */
  private move(popoverWidth: number): void {
    const selectionRect = SelectionUtils.rect as DOMRect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
    const newCoords = {
      x: selectionRect.x - wrapperOffset.x,
      y: selectionRect.y +
        selectionRect.height -
        // + window.scrollY
        wrapperOffset.top +
        this.toolbarVerticalMargin,
    };

    const realRightCoord = newCoords.x + popoverWidth + wrapperOffset.x;

    /**
     * Prevent InlineToolbar from overflowing the content zone on the right side
     */
    if (realRightCoord > this.Editor.UI.contentRect.right) {
      newCoords.x = this.Editor.UI.contentRect.right -popoverWidth - wrapperOffset.x;
    }

    this.nodes.wrapper!.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper!.style.top = Math.floor(newCoords.y) + 'px';
  }

  /**
   * Clear orientation classes and reset position
   */
  private reset(): void {
    this.nodes.wrapper!.style.left = '0';
    this.nodes.wrapper!.style.top = '0';
  }

  /**
   * Need to show Inline Toolbar or not
   */
  private allowedToShow(): boolean {
    /**
     * Tags conflicts with window.selection function.
     * Ex. IMG tag returns null (Firefox) or Redactors wrapper (Chrome)
     */
    const tagsConflictsWithSelection = ['IMG', 'INPUT'];
    const currentSelection = SelectionUtils.get();
    const selectedText = SelectionUtils.text;

    // old browsers
    if (!currentSelection || !currentSelection.anchorNode) {
      return false;
    }

    // empty selection
    if (currentSelection.isCollapsed || selectedText.length < 1) {
      return false;
    }

    const target = !$.isElement(currentSelection.anchorNode)
      ? currentSelection.anchorNode.parentElement
      : currentSelection.anchorNode;

    if (target === null) {
      return false;
    }

    if (currentSelection && tagsConflictsWithSelection.includes(target.tagName)) {
      return false;
    }

    // The selection of the element only in contenteditable
    const contenteditable = target.closest('[contenteditable="true"]');

    if (contenteditable === null) {
      return false;
    }

    // is enabled by current Block's Tool
    const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);

    if (!currentBlock) {
      return false;
    }

    return currentBlock.tool.inlineTools.size !== 0;
  }

  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Returns Inline Tools segregated by their appearance type: popover items and custom html elements.
   * Sets this.toolsInstances map
   */
  private async getInlineTools(): Promise<PopoverItemParams[]> {
    const currentSelection = SelectionUtils.get();
    const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);

    const inlineTools = Array.from(currentBlock.tool.inlineTools.values());

    const popoverItems = [] as PopoverItemParams[];

    if (this.toolsInstances === null) {
      this.toolsInstances = new Map();
    }

    for (let i = 0; i < inlineTools.length; i++) {
      const tool = inlineTools[i];
      const instance = tool.create();
      const renderedTool = await instance.render();

      this.toolsInstances.set(tool.name, instance);

      /** Enable tool shortcut */
      const shortcut = this.getToolShortcut(tool.name);

      if (shortcut) {
        try {
          this.enableShortcuts(tool.name, shortcut);
        } catch (e) {}
      }

      const shortcutBeautified = shortcut !== undefined ? _.beautifyShortcut(shortcut) : undefined;

      const toolTitle = I18n.t(
        I18nInternalNS.toolNames,
        tool.title || _.capitalize(tool.name)
      );

      [ renderedTool ].flat().forEach((item) => {
        const commonPopoverItemParams = {
          name: tool.name,
          onActivate: () => {
            this.toolClicked(instance);
          },
          hint: {
            title: toolTitle,
            description: shortcutBeautified,
          },
        } as PopoverItemParams;

        if ($.isElement(item)) {
          /**
           * Deprecated way to add custom html elements to the Inline Toolbar
           */

          const popoverItem = {
            ...commonPopoverItemParams,
            element: item,
            type: PopoverItemType.Html,
          } as PopoverItemParams;

          /**
           * If tool specifies actions in deprecated manner, append them as children
           */
          if (_.isFunction(instance.renderActions)) {
            const actions = instance.renderActions();

            (popoverItem as WithChildren<PopoverItemHtmlParams>).children = {
              isOpen: instance.checkState?.(SelectionUtils.get()),
              /** Disable keyboard navigation in actions, as it might conflict with enter press handling */
              isFlippable: false,
              items: [
                {
                  type: PopoverItemType.Html,
                  element: actions,
                },
              ],
            };
          } else {
            /**
             * Legacy inline tools might perform some UI mutating logic in checkState method, so, call it just in case
             */
            instance.checkState?.(SelectionUtils.get());
          }

          popoverItems.push(popoverItem);
        } else if (item.type === PopoverItemType.Html) {
          /**
           * Actual way to add custom html elements to the Inline Toolbar
           */
          popoverItems.push({
            ...commonPopoverItemParams,
            ...item,
            type: PopoverItemType.Html,
          });
        } else if (item.type === PopoverItemType.Separator) {
          /**
           * Separator item
           */
          popoverItems.push({
            type: PopoverItemType.Separator,
          });
        } else {
          /**
           * Default item
           */
          const popoverItem = {
            ...commonPopoverItemParams,
            ...item,
            type: PopoverItemType.Default,
          } as PopoverItemParams;

          /** Prepend with separator if item has children and not the first one */
          if ('children' in popoverItem && i !== 0) {
            popoverItems.push({
              type: PopoverItemType.Separator,
            });
          }

          popoverItems.push(popoverItem);

          /** Append separator after the item is it has children and not the last one */
          if ('children' in popoverItem && i < inlineTools.length - 1) {
            popoverItems.push({
              type: PopoverItemType.Separator,
            });
          }
        }
      });
    }

    return popoverItems;
  }

  /**
   * Get shortcut name for tool
   *
   * @param toolName — Tool name
   */
  private getToolShortcut(toolName: string): string | undefined {
    const { Tools } = this.Editor;

    /**
     * Enable shortcuts
     * Ignore tool that doesn't have shortcut or empty string
     */
    const tool = Tools.inlineTools.get(toolName);

    /**
     * 1) For internal tools, check public getter 'shortcut'
     * 2) For external tools, check tool's settings
     * 3) If shortcut is not set in settings, check Tool's public property
     */
    const internalTools = Tools.internal.inlineTools;

    if (Array.from(internalTools.keys()).includes(toolName)) {
      return this.inlineTools[toolName][CommonInternalSettings.Shortcut];
    }

    return tool?.shortcut;
  }

  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   *
   * @param toolName - tool name
   * @param shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcuts(toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      handler: (event) => {
        const { currentBlock } = this.Editor.BlockManager;

        /**
         * Editor is not focused
         */
        if (!currentBlock) {
          return;
        }

        /**
         * We allow to fire shortcut with empty selection (isCollapsed=true)
         * it can be used by tools like «Mention» that works without selection:
         * Example: by SHIFT+@ show dropdown and insert selected username
         */
        // if (SelectionUtils.isCollapsed) return;

        if (!currentBlock.tool.enabledInlineTools) {
          return;
        }

        event.preventDefault();

        this.popover?.activateItemByName(toolName);
      },
      on: this.Editor.UI.nodes.redactor,
    });
  }

  /**
   * Inline Tool button clicks
   *
   * @param tool - Tool's instance
   */
  private toolClicked(tool: IInlineTool): void {
    const range = SelectionUtils.range;

    tool.surround?.(range);
    this.checkToolsState();
  }

  /**
   * Check Tools` state by selection
   */
  private checkToolsState(): void {
    this.toolsInstances?.forEach((toolInstance) => {
      toolInstance.checkState?.(SelectionUtils.get());
    });
  }

  /**
   * Get inline tools tools
   * Tools that has isInline is true
   */
  private get inlineTools(): { [name: string]: IInlineTool } {
    const result = {} as  { [name: string]: IInlineTool } ;

    Array
      .from(this.Editor.Tools.inlineTools.entries())
      .forEach(([name, tool]) => {
        result[name] = tool.create();
      });

    return result;
  }
}
