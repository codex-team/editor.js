import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import * as _ from '../../utils';
import { InlineTool, InlineToolConstructable, ToolConstructable, ToolSettings } from '../../../../types';
import Flipper from '../../flipper';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';
import { EditorModules } from '../../../types-internal/editor-modules';

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
   * Currently visible tools instances
   */
  private toolsInstances: Map<string, InlineTool>;

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
   * Internal inline tools: Link, Bold, Italic
   */
  private internalTools: {[name: string]: InlineToolConstructable} = {};

  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  public set state(Editor: EditorModules) {
    this.Editor = Editor;

    const { Tools } = Editor;

    /**
     * Set internal inline tools
     */
    Object
      .entries(Tools.internalTools)
      .filter(([, toolClass]: [string, ToolConstructable | ToolSettings]) => {
        if (_.isFunction(toolClass)) {
          return toolClass[Tools.INTERNAL_SETTINGS.IS_INLINE];
        }

        return (toolClass as ToolSettings).class[Tools.INTERNAL_SETTINGS.IS_INLINE];
      })
      .map(([name, toolClass]: [string, InlineToolConstructable | ToolSettings]) => {
        this.internalTools[name] = _.isFunction(toolClass) ? toolClass : (toolClass as ToolSettings).class;
      });
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
   * @param {boolean} [needToClose] - pass true to close toolbar if it is not allowed.
   *                                  Avoid to use it just for closing IT, better call .close() clearly.
   */
  public tryToShow(needToClose = false): void {
    if (!this.allowedToShow()) {
      if (needToClose) {
        this.close();
      }

      return;
    }

    this.move();
    this.open();
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
   */
  public open(): void {
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

    if (this.Editor.ConversionToolbar.hasTools()) {
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
  }

  /**
   * Returns inline toolbar settings for a particular tool
   *
   * @param {string} toolName - user specified name of tool
   * @returns {string[] | boolean} array of ordered tool names or false
   */
  private getInlineToolbarSettings(toolName): string[] | boolean {
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);

    /**
     * InlineToolbar property of a particular tool
     */
    const settingsForTool = toolSettings[this.Editor.Tools.USER_SETTINGS.ENABLED_INLINE_TOOLS];

    /**
     * Whether to enable IT for a particular tool is the decision of the editor user.
     * He can enable it by the inlineToolbar settings for this tool. To enable, he should pass true or strings[]
     */
    const enabledForTool = settingsForTool === true || Array.isArray(settingsForTool);

    /**
     * Disabled by user
     */
    if (!enabledForTool) {
      return false;
    }

    /**
     * 1st priority.
     *
     * If user pass the list of inline tools for the particular tool, return it.
     */
    if (Array.isArray(settingsForTool)) {
      return settingsForTool;
    }

    /**
     * 2nd priority.
     *
     * If user pass just 'true' for tool, get common inlineToolbar settings
     * - if common settings is an array, use it
     * - if common settings is 'true' or not specified, get default order
     */

    /**
     * Common inlineToolbar settings got from the root of EditorConfig
     */
    const commonInlineToolbarSettings = this.config.inlineToolbar;

    /**
     * If common settings is an array, use it
     */
    if (Array.isArray(commonInlineToolbarSettings)) {
      return commonInlineToolbarSettings;
    }

    /**
     * If common settings is 'true' or not specified (will be set as true at core.ts), get the default order
     */
    if (commonInlineToolbarSettings === true) {
      const defaultToolsOrder: string[] = Object.entries(this.Editor.Tools.available)
        .filter(([name, tool]) => {
          return tool[this.Editor.Tools.INTERNAL_SETTINGS.IS_INLINE];
        })
        .map(([name, tool]) => {
          return name;
        });

      return defaultToolsOrder;
    }

    return false;
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

    /**
     * getInlineToolbarSettings could return an string[] (order of tools) or false (Inline Toolbar disabled).
     */
    const inlineToolbarSettings = this.getInlineToolbarSettings(currentBlock.name);

    return inlineToolbarSettings !== false;
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

    this.Editor.Tooltip.onHover(this.nodes.conversionToggler, I18n.ui(I18nInternalNS.ui.inlineToolbar.converter, 'Convert to'), {
      placement: 'top',
      hidingDelay: 100,
    });
  }

  /**
   * Changes Conversion Dropdown content for current block's Tool
   */
  private setConversionTogglerContent(): void {
    const { BlockManager, Tools } = this.Editor;
    const toolName = BlockManager.currentBlock.name;

    /**
     * If tool does not provide 'export' rule, hide conversion dropdown
     */
    const conversionConfig = Tools.available[toolName][Tools.INTERNAL_SETTINGS.CONVERSION_CONFIG] || {};
    const exportRuleDefined = conversionConfig && conversionConfig.export;

    this.nodes.conversionToggler.hidden = !exportRuleDefined;
    this.nodes.conversionToggler.classList.toggle(this.CSS.conversionTogglerHidden, !exportRuleDefined);

    /**
     * Get icon or title for dropdown
     */
    const toolSettings = Tools.getToolSettings(toolName);
    const toolboxSettings = Tools.available[toolName][Tools.INTERNAL_SETTINGS.TOOLBOX] || {};
    const userToolboxSettings = toolSettings.toolbox || {};

    this.nodes.conversionTogglerContent.innerHTML =
      userToolboxSettings.icon ||
      toolboxSettings.icon ||
      userToolboxSettings.title ||
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

    /**
     * Filter buttons if Block Tool pass config like inlineToolbar=['link']
     * Else filter them according to the default inlineToolbar property.
     *
     * For this moment, inlineToolbarOrder could not be 'false'
     * because this method will be called only if the Inline Toolbar is enabled
     */
    const inlineToolbarOrder = this.getInlineToolbarSettings(currentBlock.name) as string[];

    inlineToolbarOrder.forEach((toolName) => {
      const toolSettings = this.Editor.Tools.getToolSettings(toolName);
      const tool = this.Editor.Tools.constructInline(this.Editor.Tools.inline[toolName], toolName, toolSettings);

      this.addTool(toolName, tool);
      tool.checkState(SelectionUtils.get());
    });

    /**
     * Recalculate width because some buttons can be hidden
     */
    this.recalculateWidth();
  }

  /**
   * Add tool button and activate clicks
   *
   * @param {string} toolName - name of Tool to add
   * @param {InlineTool} tool - Tool class instance
   */
  private addTool(toolName: string, tool: InlineTool): void {
    const {
      Tools,
      Tooltip,
    } = this.Editor;

    const button = tool.render();

    if (!button) {
      _.log('Render method must return an instance of Node', 'warn', toolName);

      return;
    }

    button.dataset.tool = toolName;
    this.nodes.buttons.appendChild(button);
    this.toolsInstances.set(toolName, tool);

    if (_.isFunction(tool.renderActions)) {
      const actions = tool.renderActions();

      this.nodes.actions.appendChild(actions);
    }

    this.listeners.on(button, 'click', (event) => {
      this.toolClicked(tool);
      event.preventDefault();
    });

    const shortcut = this.getToolShortcut(toolName);

    if (shortcut) {
      this.enableShortcuts(tool, shortcut);
    }

    /**
     * Enable tooltip module on button
     */
    const tooltipContent = $.make('div');
    const toolTitle = I18n.t(
      I18nInternalNS.toolNames,
      Tools.toolsClasses[toolName][Tools.INTERNAL_SETTINGS.TITLE] || _.capitalize(toolName)
    );

    tooltipContent.appendChild($.text(toolTitle));

    if (shortcut) {
      tooltipContent.appendChild($.make('div', this.CSS.inlineToolbarShortcut, {
        textContent: _.beautifyShortcut(shortcut),
      }));
    }

    Tooltip.onHover(button, tooltipContent, {
      placement: 'top',
      hidingDelay: 100,
    });
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
    const toolSettings = Tools.getToolSettings(toolName);
    const tool = this.toolsInstances.get(toolName);

    /**
     * 1) For internal tools, check public getter 'shortcut'
     * 2) For external tools, check tool's settings
     * 3) If shortcut is not set in settings, check Tool's public property
     */
    if (Object.keys(this.internalTools).includes(toolName)) {
      return this.inlineTools[toolName][Tools.INTERNAL_SETTINGS.SHORTCUT];
    } else if (toolSettings && toolSettings[Tools.USER_SETTINGS.SHORTCUT]) {
      return toolSettings[Tools.USER_SETTINGS.SHORTCUT];
    } else if (tool.shortcut) {
      return tool.shortcut;
    }
  }

  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   *
   * @param {InlineTool} tool - Tool instance
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcuts(tool: InlineTool, shortcut: string): void {
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

        const toolSettings = this.Editor.Tools.getToolSettings(currentBlock.name);

        if (!toolSettings || !toolSettings[this.Editor.Tools.USER_SETTINGS.ENABLED_INLINE_TOOLS]) {
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
  private toolClicked(tool: InlineTool): void {
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
  private get inlineTools(): { [name: string]: InlineTool } {
    const result = {};

    for (const tool in this.Editor.Tools.inline) {
      if (Object.prototype.hasOwnProperty.call(this.Editor.Tools.inline, tool)) {
        const toolSettings = this.Editor.Tools.getToolSettings(tool);

        result[tool] = this.Editor.Tools.constructInline(this.Editor.Tools.inline[tool], tool, toolSettings);
      }
    }

    return result;
  }

  /**
   * Allow to leaf buttons by arrows / tab
   * Buttons will be filled on opening
   */
  private enableFlipper(): void {
    this.flipper = new Flipper({
      focusedItemClass: this.CSS.focusedButton,
      allowArrows: false,
    });
  }
}
