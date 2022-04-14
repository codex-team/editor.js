import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import * as _ from '../../utils';
import { InlineTool as IInlineTool } from '../../../../types';
import Flipper from '../../flipper';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';
import Tooltip from '../../utils/tooltip';
import { ModuleConfig } from '../../../types-internal/module-config';
import InlineTool from '../../tools/inline';
import { CommonInternalSettings } from '../../tools/base';

/**
 * Inline Toolbar elements
 */
interface InlineToolbarNodes {
  wrapper: HTMLElement;
  togglerAndButtonsWrapper: HTMLElement;
  buttons: HTMLElement;
  conversionToggler: HTMLElement;
  conversionTogglerContent: HTMLElement;
  /**
   * Zone below the buttons where Tools can create additional actions by 'renderActions()' method
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   */
  actions: HTMLElement;
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
    buttonsWrapper: 'ce-inline-toolbar__buttons',
    actionsWrapper: 'ce-inline-toolbar__actions',
    inlineToolButton: 'ce-inline-tool',
    inputField: 'cdx-input',
    focusedButton: 'ce-inline-tool--focused',
    conversionToggler: 'ce-inline-toolbar__dropdown',
    conversionTogglerHidden: 'ce-inline-toolbar__dropdown--hidden',
    conversionTogglerContent: 'ce-inline-toolbar__dropdown-content',
    togglerAndButtonsWrapper: 'ce-inline-toolbar__toggler-and-button-wrapper',
  };

  /**
   * State of inline toolbar
   *
   * @type {boolean}
   */
  public opened = false;

  /**
   * Margin above/below the Toolbar
   */
  private readonly toolbarVerticalMargin: number = 5;

  /**
   * TODO: Get rid of this
   *
   * Currently visible tools instances
   */
  private toolsInstances: Map<string, IInlineTool>;

  /**
   * Buttons List
   *
   * @type {NodeList}
   */
  private buttonsList: NodeList = null;

  /**
   * Cache for Inline Toolbar width
   *
   * @type {number}
   */
  private width = 0;

  /**
   * Instance of class that responses for leafing buttons by arrows/tab
   */
  private flipper: Flipper = null;

  /**
   * Tooltip utility Instance
   */
  private tooltip: Tooltip;
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
    this.tooltip = new Tooltip();
  }

  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.make();
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
  public tryToShow(needToClose = false, needToShowConversionToolbar = true): void {
    if (!this.allowedToShow()) {
      if (needToClose) {
        this.close();
      }

      return;
    }

    this.move();
    this.open(needToShowConversionToolbar);
    this.Editor.Toolbar.close();
  }

  /**
   * Move Toolbar to the selected text
   */
  public move(): void {
    const selectionRect = SelectionUtils.rect as DOMRect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
    const newCoords = {
      x: selectionRect.x - wrapperOffset.left,
      y: selectionRect.y +
        selectionRect.height -
        // + window.scrollY
        wrapperOffset.top +
        this.toolbarVerticalMargin,
    };

    /**
     * If we know selections width, place InlineToolbar to center
     */
    if (selectionRect.width) {
      newCoords.x += Math.floor(selectionRect.width / 2);
    }

    /**
     * Inline Toolbar has -50% translateX, so we need to check real coords to prevent overflowing
     */
    const realLeftCoord = newCoords.x - this.width / 2;
    const realRightCoord = newCoords.x + this.width / 2;

    /**
     * By default, Inline Toolbar has top-corner at the center
     * We are adding a modifiers for to move corner to the left or right
     */
    this.nodes.wrapper.classList.toggle(
      this.CSS.inlineToolbarLeftOriented,
      realLeftCoord < this.Editor.UI.contentRect.left
    );

    this.nodes.wrapper.classList.toggle(
      this.CSS.inlineToolbarRightOriented,
      realRightCoord > this.Editor.UI.contentRect.right
    );

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
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

    this.opened = false;

    this.flipper.deactivate();
    this.Editor.ConversionToolbar.close();
  }

  /**
   * Shows Inline Toolbar
   *
   * @param [needToShowConversionToolbar] - pass false to not to show Conversion Toolbar
   */
  public open(needToShowConversionToolbar = true): void {
    if (this.opened) {
      return;
    }
    /**
     * Filter inline-tools and show only allowed by Block's Tool
     */
    this.addToolsFiltered();

    /**
     * Show Inline Toolbar
     */
    this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);

    this.buttonsList = this.nodes.buttons.querySelectorAll(`.${this.CSS.inlineToolButton}`);
    this.opened = true;

    if (needToShowConversionToolbar && this.Editor.ConversionToolbar.hasTools()) {
      /**
       * Change Conversion Dropdown content for current tool
       */
      this.setConversionTogglerContent();
    } else {
      /**
       * hide Conversion Dropdown with there are no tools
       */
      this.nodes.conversionToggler.hidden = true;
    }

    /**
     * Get currently visible buttons to pass it to the Flipper
     */
    let visibleTools = Array.from(this.buttonsList);

    visibleTools.unshift(this.nodes.conversionToggler);
    visibleTools = visibleTools.filter((tool) => !(tool as HTMLElement).hidden);

    this.flipper.activate(visibleTools as HTMLElement[]);
  }

  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to chcek
   */
  public containsNode(node: Node): boolean {
    return this.nodes.wrapper.contains(node);
  }

  /**
   * Removes UI and its components
   */
  public destroy(): void {
    /**
     * Sometimes (in read-only mode) there is no Flipper
     */
    if (this.flipper) {
      this.flipper.deactivate();
      this.flipper = null;
    }

    this.removeAllNodes();
    this.tooltip.destroy();
  }

  /**
   * Making DOM
   */
  private make(): void {
    this.nodes.wrapper = $.make('div', [
      this.CSS.inlineToolbar,
      ...(this.isRtl ? [ this.Editor.UI.CSS.editorRtlFix ] : []),
    ]);
    /**
     * Creates a different wrapper for toggler and buttons.
     */
    this.nodes.togglerAndButtonsWrapper = $.make('div', this.CSS.togglerAndButtonsWrapper);
    this.nodes.buttons = $.make('div', this.CSS.buttonsWrapper);
    this.nodes.actions = $.make('div', this.CSS.actionsWrapper);

    // To prevent reset of a selection when click on the wrapper
    this.listeners.on(this.nodes.wrapper, 'mousedown', (event) => {
      const isClickedOnActionsWrapper = (event.target as Element).closest(`.${this.CSS.actionsWrapper}`);

      // If click is on actions wrapper,
      // do not prevent default behaviour because actions might include interactive elements
      if (!isClickedOnActionsWrapper) {
        event.preventDefault();
      }
    });

    /**
     * Append the intermediary wrapper which contains toggler and buttons and button actions.
     */
    $.append(this.nodes.wrapper, [this.nodes.togglerAndButtonsWrapper, this.nodes.actions]);
    /**
     * Append the inline toolbar to the editor.
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    /**
     * Add button that will allow switching block type
     */
    this.addConversionToggler();

    /**
     * Wrapper for the inline tools
     * Will be appended after the Conversion Toolbar toggler
     */
    $.append(this.nodes.togglerAndButtonsWrapper, this.nodes.buttons);

    /**
     * Prepare conversion toolbar.
     * If it has any conversion tool then it will be enabled in the Inline Toolbar
     */
    this.prepareConversionToolbar();

    /**
     * Recalculate initial width with all buttons
     */
    this.recalculateWidth();

    /**
     * Allow to leaf buttons by arrows / tab
     * Buttons will be filled on opening
     */
    this.enableFlipper();
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
   * Create a toggler for Conversion Dropdown
   * and prepend it to the buttons list
   */
  private addConversionToggler(): void {
    this.nodes.conversionToggler = $.make('div', this.CSS.conversionToggler);
    this.nodes.conversionTogglerContent = $.make('div', this.CSS.conversionTogglerContent);

    const icon = $.svg('toggler-down', 13, 13);

    this.nodes.conversionToggler.appendChild(this.nodes.conversionTogglerContent);
    this.nodes.conversionToggler.appendChild(icon);

    this.nodes.togglerAndButtonsWrapper.appendChild(this.nodes.conversionToggler);

    this.listeners.on(this.nodes.conversionToggler, 'click', () => {
      this.Editor.ConversionToolbar.toggle((conversionToolbarOpened) => {
        /**
         * When ConversionToolbar is opening on activated InlineToolbar flipper
         * Then we need to temporarily deactivate InlineToolbar flipper so that we could flip ConversionToolbar items
         *
         * Other case when ConversionToolbar is closing (for example, by escape) but we need to continue flipping
         * InlineToolbar items, we activate InlineToolbar flipper
         */
        const canActivateInlineToolbarFlipper = !conversionToolbarOpened && this.opened;

        if (canActivateInlineToolbarFlipper) {
          this.flipper.activate();
        } else if (this.opened) {
          this.flipper.deactivate();
        }
      });
    });

    this.tooltip.onHover(this.nodes.conversionToggler, I18n.ui(I18nInternalNS.ui.inlineToolbar.converter, 'Convert to'), {
      placement: 'top',
      hidingDelay: 100,
    });
  }

  /**
   * Changes Conversion Dropdown content for current block's Tool
   */
  private setConversionTogglerContent(): void {
    const { BlockManager } = this.Editor;
    const { currentBlock } = BlockManager;
    const toolName = currentBlock.name;

    /**
     * If tool does not provide 'export' rule, hide conversion dropdown
     */
    const conversionConfig = currentBlock.tool.conversionConfig;
    const exportRuleDefined = conversionConfig && conversionConfig.export;

    this.nodes.conversionToggler.hidden = !exportRuleDefined;
    this.nodes.conversionToggler.classList.toggle(this.CSS.conversionTogglerHidden, !exportRuleDefined);

    /**
     * Get icon or title for dropdown
     */
    const toolboxSettings = currentBlock.tool.toolbox || {};

    this.nodes.conversionTogglerContent.innerHTML =
      toolboxSettings.icon ||
      toolboxSettings.title ||
      _.capitalize(toolName);
  }

  /**
   * Makes the Conversion Dropdown
   */
  private prepareConversionToolbar(): void {
    const ct = this.Editor.ConversionToolbar.make();

    $.append(this.nodes.wrapper, ct);
  }

  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Append only allowed Tools
   */
  private addToolsFiltered(): void {
    const currentSelection = SelectionUtils.get();
    const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);

    /**
     * Clear buttons list
     */
    this.nodes.buttons.innerHTML = '';
    this.nodes.actions.innerHTML = '';
    this.toolsInstances = new Map();

    Array.from(currentBlock.tool.inlineTools.values()).forEach(tool => {
      this.addTool(tool);
    });

    /**
     * Recalculate width because some buttons can be hidden
     */
    this.recalculateWidth();
  }

  /**
   * Add tool button and activate clicks
   *
   * @param {InlineTool} tool - InlineTool object
   */
  private addTool(tool: InlineTool): void {
    const instance = tool.create();
    const button = instance.render();

    if (!button) {
      _.log('Render method must return an instance of Node', 'warn', tool.name);

      return;
    }

    button.dataset.tool = tool.name;
    this.nodes.buttons.appendChild(button);
    this.toolsInstances.set(tool.name, instance);

    if (_.isFunction(instance.renderActions)) {
      const actions = instance.renderActions();

      this.nodes.actions.appendChild(actions);
    }

    this.listeners.on(button, 'click', (event) => {
      this.toolClicked(instance);
      event.preventDefault();
    });

    const shortcut = this.getToolShortcut(tool.name);

    if (shortcut) {
      try {
        this.enableShortcuts(instance, shortcut);
      } catch (e) {}
    }

    /**
     * Enable tooltip module on button
     */
    const tooltipContent = $.make('div');
    const toolTitle = I18n.t(
      I18nInternalNS.toolNames,
      tool.title || _.capitalize(tool.name)
    );

    tooltipContent.appendChild($.text(toolTitle));

    if (shortcut) {
      tooltipContent.appendChild($.make('div', this.CSS.inlineToolbarShortcut, {
        textContent: _.beautifyShortcut(shortcut),
      }));
    }

    this.tooltip.onHover(button, tooltipContent, {
      placement: 'top',
      hidingDelay: 100,
    });

    instance.checkState(SelectionUtils.get());
  }

  /**
   * Get shortcut name for tool
   *
   * @param toolName — Tool name
   */
  private getToolShortcut(toolName): string | void {
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

    return tool.shortcut;
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

  /**
   * Allow to leaf buttons by arrows / tab
   * Buttons will be filled on opening
   */
  private enableFlipper(): void {
    this.flipper = new Flipper({
      focusedItemClass: this.CSS.focusedButton,
      allowedKeys: [
        _.keyCodes.ENTER,
        _.keyCodes.TAB,
      ],
    });
  }
}
