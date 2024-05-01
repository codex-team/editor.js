import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import * as _ from '../../utils';
import { InlineTool as IInlineTool } from '../../../../types';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';
import * as tooltip from '../../utils/tooltip';
import { ModuleConfig } from '../../../types-internal/module-config';
import { CommonInternalSettings } from '../../tools/base';
import { Popover, PopoverEvent, PopoverItemDefaultParams, PopoverItemParams, PopoverItemWithChildrenParams } from '../../utils/popover';
import { PopoverInline } from '../../utils/popover/popover-inline';
import { getConvertToItems } from '../../utils/blocks';
import { IconReplace } from '@codexteam/icons';

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
    inlineToolbarShowed: 'ce-inline-toolbar--showed',
    inlineToolbarLeftOriented: 'ce-inline-toolbar--left-oriented',
    inlineToolbarRightOriented: 'ce-inline-toolbar--right-oriented',
    inlineToolbarShortcut: 'ce-inline-toolbar__shortcut',
  };

  /**
   * State of inline toolbar
   *
   * @type {boolean}
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
  private toolsInstances: Map<string, IInlineTool> = new Map();

  /**
   * Cache for Inline Toolbar width
   *
   * @type {number}
   */
  private width = 0;

  private selection = new SelectionUtils();

  private actionsOpen = false;

  /**
   * @class
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
      this.Editor.ConversionToolbar.destroy();
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
   * @param [needToShowConversionToolbar] - pass false to not to show Conversion Toolbar
   */
  public async tryToShow(needToClose = false, needToShowConversionToolbar = true): Promise<void> {
    if (this.actionsOpen) {
      return;
    }
    if (needToClose) {
      this.close();
    }

    if (!this.allowedToShow()) {
      return;
    }

    this.move();
    await this.open(needToShowConversionToolbar);
    this.Editor.Toolbar.close();
  }

  /**
   * Hides Inline Toolbar
   */
  public close(): void {
    if (!this.opened || this.doNotClose) {
      return;
    }

    if (this.Editor.ReadOnly.isEnabled) {
      return;
    }

    this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);

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

    this.reset();
    this.opened = false;

    // this.flipper.deactivate();
    this.Editor.ConversionToolbar.close();

    if (this.selection.isFakeBackgroundEnabled) {
      this.selection.restore();
      this.selection.removeFakeBackground();
    }

    this.popover?.hide();
    this.popover?.off(PopoverEvent.OpenNestedPopover, this.onActionsOpen);
    this.popover?.off(PopoverEvent.Close, this.onActionsClose);
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

    // To prevent reset of a selection when click on the wrapper
    this.listeners.on(this.nodes.wrapper, 'mousedown', (event) => {
      // const isClickedOnActionsWrapper = (event.target as Element).closest(`.${this.CSS.actionsWrapper}`);

      // // If click is on actions wrapper,
      // // do not prevent default behavior because actions might include interactive elements
      // if (!isClickedOnActionsWrapper) {
      //   event.preventDefault();
      // }
    });

    /**
     * Append the inline toolbar to the editor.
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    /**
     * Recalculate initial width with all buttons
     * We use RIC to prevent forced layout during editor initialization to make it faster
     */
    window.requestAnimationFrame(() => {
      this.recalculateWidth();
    });
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
    this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);

    this.opened = true;


    if (this.popover !== null) {
      this.popover.destroy();
    }

    const { htmlElements, popoverItems } = await this.getInlineTools();
    const container = document.createElement('div');

    htmlElements.forEach((element) => container.appendChild(element));

    this.popover = new PopoverInline({
      items: popoverItems,
      customContent: container,
      customContentFlippableItems: $.getControls(container, this.Editor.StylesAPI),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    });

    this.popover.on(PopoverEvent.OpenNestedPopover, this.onActionsOpen);
    this.popover.on(PopoverEvent.Close, this.onActionsClose);

    this.nodes.wrapper?.append(this.popover.getElement());

    this.popover.show();
  }

  private onActionsOpen = () => {
    // this.actionsOpen = true;
    // this.Editor.UI.disableSelectionChangeEvents();

    // this.selection.setFakeBackground();
    // this.selection.save();

    // this.listeners.on(document, 'click', this.onClick);


    // setTimeout(() => {
    //   this.Editor.UI.enableSelectionChangeEvents();
    // }, 200);
  };

  private onClick = (event) => {
    const target = event.target as HTMLElement;

    if (!this.nodes.wrapper?.contains(target) && !this.popover?.getElement().contains(target)) {
      console.log('clickaway');
      // this.selection.restore();
      // this.selection.removeFakeBackground();
      // this.selection.removeFakeBackground();


      // this.selection.restore();
      // this.selection.removeFakeBackground();
      // this.popover?.cl();
      this.close();
      // this.actionsOpen = false;
      this.listeners.off(document, 'click', this.onClick);
      // this.actionsOpen = false;
    }
  };

  private onActionsClose = () => { // / this is not called!!!
    console.log('onActionsClose');
    // this.Editor.UI.disableSelectionChangeEvents();

    // this.selection.restore();
    // this.selection.removeFakeBackground();
    // this.actionsOpen = false;

    // this.Editor.UI.enableSelectionChangeEvents();
  };

  /**
   * Move Toolbar to the selected text
   */
  private move(): void {
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

    const realRightCoord = newCoords.x + this.width + wrapperOffset.x;

    /**
     * Prevent InlineToolbar from overflowing the content zone on the right side
     */
    if (realRightCoord > this.Editor.UI.contentRect.right) {
      newCoords.x = this.Editor.UI.contentRect.right - this.width - wrapperOffset.x;
    }

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
  }

  /**
   * Clear orientation classes and reset position
   */
  private reset(): void {
    this.nodes.wrapper.classList.remove(
      this.CSS.inlineToolbarLeftOriented,
      this.CSS.inlineToolbarRightOriented
    );

    this.nodes.wrapper.style.left = '0';
    this.nodes.wrapper.style.top = '0';
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
   * Recalculate inline toolbar width
   */
  private recalculateWidth(): void {
    this.width = this.nodes.wrapper.offsetWidth;
  }


  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Returns Inline Tools segregated by their appearance type: popover items and custom html elements.
   * Sets this.toolsInstances map
   */
  private async getInlineTools(): Promise<{ popoverItems: PopoverItemParams[], htmlElements: HTMLElement[] }> {
    const currentSelection = SelectionUtils.get();
    const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);

    const inlineTools = Array.from(currentBlock.tool.inlineTools.values());

    const popoverItems = [] as PopoverItemParams[];
    const htmlElements = [] as HTMLElement[];

    /** Add "Convert to" */
    const convertToItems = await getConvertToItems(currentBlock, this.Editor);

    if (convertToItems.length > 0) {
      popoverItems.push({
        icon: IconReplace,
        title: I18n.ui(I18nInternalNS.ui.popover, 'Convert to'),
        children: {
          searchable: true,
          items: convertToItems,
        },
      });
      popoverItems.push({
        type: 'separator',
      });
    }

    inlineTools.forEach(tool => {
      const instance = tool.create();
      const controlData = instance.render();

      this.toolsInstances.set(tool.name, instance);

      /** Enable tool shortcut */
      const shortcut = this.getToolShortcut(tool.name);

      if (shortcut) {
        try {
          this.enableShortcuts(instance, shortcut);
        } catch (e) {}
      }

      const shortcutBeautified = shortcut !== undefined ? _.beautifyShortcut(shortcut) : undefined;

      const toolTitle = I18n.t(
        I18nInternalNS.toolNames,
        tool.title || _.capitalize(tool.name)
      );

      if ($.isElement(controlData)) {
        htmlElements.push(
          this.prepareInlineToolHtml(controlData, instance, toolTitle, shortcutBeautified)
        );
      } else if (Array.isArray(controlData)) {
        const items = (controlData as PopoverItemParams[]).map(item => this.prepareInlineToolItem(item, instance, toolTitle, shortcutBeautified));

        popoverItems.push(...items);
      } else {
        popoverItems.push(this.prepareInlineToolItem(controlData, instance, toolTitle, shortcutBeautified));
      }

      // if (_.isFunction(instance.renderActions)) {
      //   const actions = instance.renderActions();

      //   // this.nodes.actions.appendChild(actions);
      // }
    });

    return {
      popoverItems,
      htmlElements,
    };
  }

  /**
   * Prepare inline tool item for being displayed in popover – set on click handler, hint, etc.
   *
   * @param item – item to prepare
   * @param toolInstance – tool instance
   * @param toolTitle – tool title
   * @param shortcut – tool shortcut
   */
  private prepareInlineToolItem(item: PopoverItemParams, toolInstance: IInlineTool, toolTitle: string, shortcut: string | undefined): PopoverItemDefaultParams {
    const result =  {
      ...item,
      onActivate: (activatedItem: PopoverItemParams) => {
        // @todo proper check
        if ('children' in activatedItem) {
          return;
        }
        this.toolClicked(toolInstance);
      },
      hint: {
        title: toolTitle,
        description: shortcut,
      },
      isActive: toolInstance.checkState(SelectionUtils.get()),
    } as PopoverItemDefaultParams;

    if (_.isFunction(toolInstance.renderActions)) {
      const actions = toolInstance.renderActions();

      (result as PopoverItemWithChildrenParams).children = {
        customHtml: actions,
      };
    }

    return result;
  }

  /**
   * Prepare inline tool html element for being displayed in popover – attach on click handler, tooltip, etc.
   *
   * @param htmlElement – tool control html element
   * @param toolInstance – tool instance
   * @param toolTitle – tool title
   * @param shortcut – tool shortcut
   */
  private prepareInlineToolHtml(htmlElement: HTMLElement, toolInstance: IInlineTool, toolTitle: string, shortcut: string | undefined): HTMLElement {
    /** Set click handler */
    this.listeners.on(htmlElement, 'click', (event) => {
      this.toolClicked(toolInstance);
      event.preventDefault();
    });

    /**
     * Enable tooltip module on button
     */
    const tooltipContent = $.make('div');


    tooltipContent.appendChild($.text(toolTitle));

    if (shortcut !== undefined) {
      tooltipContent.appendChild($.make('div', this.CSS.inlineToolbarShortcut, {
        textContent: _.beautifyShortcut(shortcut),
      }));
    }

    if (_.isMobileScreen() === false ) {
      tooltip.onHover(htmlElement, tooltipContent, {
        placement: 'top',
        hidingDelay: 100,
      });
    }

    toolInstance.checkState(SelectionUtils.get());

    return htmlElement;
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
   * @param {InlineTool} tool - Tool instance
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcuts(tool: IInlineTool, shortcut: string): void {
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
        this.toolClicked(tool);
      },
      on: this.Editor.UI.nodes.redactor,
    });
  }

  /**
   * Inline Tool button clicks
   *
   * @param {InlineTool} tool - Tool's instance
   */
  private toolClicked(tool: IInlineTool): void {
    const range = SelectionUtils.range;

    tool.surround(range);
    this.checkToolsState();

    /**
     * If tool has "actions", so after click it will probably toggle them on.
     * For example, the Inline Link Tool will show the URL-input.
     * So we disable the Flipper for that case to allow Tool bind own Enter listener
     */
    if (tool.renderActions !== undefined) {
      // this.flipper.deactivate();
    }
  }

  /**
   * Check Tools` state by selection
   */
  private checkToolsState(): void {
    this.toolsInstances.forEach((toolInstance) => {
      toolInstance.checkState(SelectionUtils.get());
    });
  }

  /**
   * Get inline tools tools
   * Tools that has isInline is true
   */
  private get inlineTools(): { [name: string]: IInlineTool } {
    const result = {};

    Array
      .from(this.Editor.Tools.inlineTools.entries())
      .forEach(([name, tool]) => {
        result[name] = tool.create();
      });

    return result;
  }
}
