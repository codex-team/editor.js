import $ from '../dom';
import SelectionUtils from '../selection';
import * as _ from '../utils';
import { InlineTool as IInlineTool, EditorConfig } from '../../../types';
import Flipper from '../flipper';
import I18n from '../i18n';
import { I18nInternalNS } from '../i18n/namespace-internal';
import Shortcuts from '../utils/shortcuts';
import Tooltip from '../utils/tooltip';
import { ModuleConfig } from '../../types-internal/module-config';
import InlineTool from '../tools/inline';
import { CommonInternalSettings } from '../tools/base';
import ToolsCollection from '../tools/collection';
import Selection from '../selection';
import Block from '../block';

/**
 * Inline Toolbar elements
 */
interface InlineToolbarNodes {
  wrapper: HTMLElement;
  togglerAndButtonsWrapper: HTMLElement;
  buttons: HTMLElement;
  /**
   * Zone below the buttons where Tools can create additional actions by 'renderActions()' method
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   */
  actions: HTMLElement;
}

let created = false;

const nodes: InlineToolbarNodes = {
  wrapper: undefined,
  buttons: undefined,
  togglerAndButtonsWrapper: undefined,
  actions: undefined,
};

document.addEventListener('selectionchange', (event: Event) => {
  document.dispatchEvent(new CustomEvent('ch', {
    detail: {
      activeElement: document.activeElement,
    },
  }));
  // this.selectionChanged(event, this.ownerElement);
}, true);

/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 * |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
 * |   B  i [link] [mark]   |
 * |________________________|
 */
export default class InlineToolbar {
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
  private ownerElement: Element;

  private isRtl = false;
  private tools: ToolsCollection<InlineTool>;

  /**
   * @class
   */
  constructor({ element, isRtl, tools }) {
    this.ownerElement = element;
    this.isRtl = isRtl;
    this.tools = tools;

    /**
     * @todo check on multiple instances
     */
    this.tooltip = new Tooltip();

    document.addEventListener('ch', (event) => {
      this.selectionChanged(event)
    })

    /**
     * Allow to leaf buttons by arrows / tab
     * Buttons will be filled on opening
     */
    this.enableFlipper();


    if (created) {
      return;
    }

    this.make();

    document.addEventListener('selectionchange', (event: Event) => {
      document.dispatchEvent(new CustomEvent('ch', {
        detail: {
          activeElement: document.activeElement,
        },
      }));
      // this.selectionChanged(event, this.ownerElement);
    }, true);

    created = true;
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
      /**
       * @todo add ConversionToolbar support
       */
      // this.Editor.ConversionToolbar.destroy();
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
    const allowedToShow = this.allowedToShow();

    if (!allowedToShow) {
      if (needToClose) {
        this.close();
      }

      return;
    }

    this.move();
    this.open();
    /**
     * @todo move it to onOpen callback
     */
    // this.Editor.Toolbar.close();
  }

  /**
   * Move Toolbar to the selected text
   */
  public move(): void {
    const selectionRect = SelectionUtils.rect as DOMRect;
    const wrapperOffset = this.ownerElement.getBoundingClientRect();

    const newCoords = {
      x: selectionRect.x,
      y: selectionRect.y +
        selectionRect.height + // -
        window.scrollY +
        // wrapperOffset.top +
        -100 + // tmp
        this.toolbarVerticalMargin,
    };

    /**
     * If we know selections width, place InlineToolbar to center
     */
    // if (selectionRect.width) {
    //   newCoords.x += Math.floor(selectionRect.width / 2);
    // }
    //
    // /**
    //  * Inline Toolbar has -50% translateX, so we need to check real coords to prevent overflowing
    //  */
    // const realLeftCoord = newCoords.x - this.width / 2;
    // const realRightCoord = newCoords.x + this.width / 2;
    //
    // /**
    //  * By default, Inline Toolbar has top-corner at the center
    //  * We are adding a modifiers for to move corner to the left or right
    //  */
    // nodes.wrapper.classList.toggle(
    //   this.CSS.inlineToolbarLeftOriented,
    //   realLeftCoord < this.editorContentRect.left
    // );
    //
    // nodes.wrapper.classList.toggle(
    //   this.CSS.inlineToolbarRightOriented,
    //   realRightCoord > this.editorContentRect.right
    // );

    nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
  }

  /**
   * Hides Inline Toolbar
   */
  public close(): void {
    if (!this.opened) {
      return;
    }

    /**
     * @todo check Readonly work
     */
    // if (this.Editor.ReadOnly.isEnabled) {
    //   return;
    // }

    nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);
    Array.from(this.toolsInstances.entries()).forEach(([name, toolInstance]) => {
      const shortcut = this.getToolShortcut(name);

      /**
       * @todo check shortucts removing
       */
      if (shortcut) {
        // Shortcuts.remove(this.Editor.UI.nodes.redactor, shortcut);
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
    /**
     * @todo check
     */
    // this.Editor.ConversionToolbar.close();
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
    nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);

    this.buttonsList = nodes.buttons.querySelectorAll(`.${this.CSS.inlineToolButton}`);
    this.opened = true;

    /**
     * @todo check ConversionToolbar
     */
    // if (needToShowConversionToolbar && this.Editor.ConversionToolbar.hasTools()) {
    //   /**
    //    * Change Conversion Dropdown content for current tool
    //    */
    //   this.setConversionTogglerContent();
    // } else {
    //   /**
    //    * hide Conversion Dropdown with there are no tools
    //    */
    //   nodes.conversionToggler.hidden = true;
    // }

    /**
     * Get currently visible buttons to pass it to the Flipper
     */
    let visibleTools = Array.from(this.buttonsList);

    /**
     * @todo ConversionToolbar
     */
    // visibleTools.unshift(nodes.conversionToggler);
    visibleTools = visibleTools.filter((tool) => !(tool as HTMLElement).hidden);

    this.flipper.activate(visibleTools as HTMLElement[]);
  }

  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to chcek
   */
  public containsNode(node: Node): boolean {
    return nodes.wrapper.contains(node);
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
   * Remove memorized nodes
   */
  public removeAllNodes(): void {
    for (const key in nodes) {
      const node = nodes[key];

      if (node instanceof HTMLElement) {
        node.remove();
      }
    }
  }

  private selectionChanged(event: Event): void {
    const activeElement = event.detail.activeElement;
    const ownerSelected = activeElement === this.ownerElement;
    const ownerContainsSelection = this.ownerElement.contains(activeElement);

    if (ownerSelected || ownerContainsSelection) {
      this.tryToShow(true);
    }
  }

  /**
   * Making DOM
   */
  private make(): void {
    if (nodes.wrapper) {
      console.log('already created');

      return;
    }

    nodes.wrapper = $.make('div', [
      this.CSS.inlineToolbar,
      /**
       * @todo Add RTL fix
       */
      // ...(this.isRtl ? [ this.Editor.UI.CSS.editorRtlFix ] : []),
    ]);
    /**
     * Creates a different wrapper for toggler and buttons.
     */
    nodes.togglerAndButtonsWrapper = $.make('div', this.CSS.togglerAndButtonsWrapper);
    nodes.buttons = $.make('div', this.CSS.buttonsWrapper);
    nodes.actions = $.make('div', this.CSS.actionsWrapper);

    // To prevent reset of a selection when click on the wrapper
    // @todo check this case
    // this.listeners.on(nodes.wrapper, 'mousedown', (event) => {
    //   const isClickedOnActionsWrapper = (event.target as Element).closest(`.${this.CSS.actionsWrapper}`);
    //
    //   // If click is on actions wrapper,
    //   // do not prevent default behaviour because actions might include interactive elements
    //   if (!isClickedOnActionsWrapper) {
    //     event.preventDefault();
    //   }
    // });

    /**
     * Append the intermediary wrapper which contains toggler and buttons and button actions.
     */
    $.append(nodes.wrapper, [nodes.togglerAndButtonsWrapper, nodes.actions]);
    /**
     * Append the inline toolbar to the editor.
     */
    /**
     * @todo check
     */
    // $.append(this.Editor.UI.nodes.wrapper, nodes.wrapper);
    $.append(document.body, nodes.wrapper);

    /**
     * Wrapper for the inline tools
     * Will be appended after the Conversion Toolbar toggler
     */
    $.append(nodes.togglerAndButtonsWrapper, nodes.buttons);

    /**
     * Recalculate initial width with all buttons
     */
    this.recalculateWidth();
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

    // is enabled by current Block's Tool

    /**
     * @todo check
     */
    // const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);
    //
    // if (!currentBlock) {
    //   return false;
    // }

    // return currentBlock.tool.inlineTools.size !== 0;

    return true;
  }

  /**
   * Recalculate inline toolbar width
   */
  private recalculateWidth(): void {
    this.width = nodes.wrapper.offsetWidth;
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
    // const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode as HTMLElement);

    /**
     * Clear buttons list
     */
    nodes.buttons.innerHTML = '';
    nodes.actions.innerHTML = '';
    this.toolsInstances = new Map();

    Array.from(this.tools.values()).forEach(tool => {
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
    nodes.buttons.appendChild(button);
    this.toolsInstances.set(tool.name, instance);

    if (_.isFunction(instance.renderActions)) {
      const actions = instance.renderActions();

      nodes.actions.appendChild(actions);
    }

    /**
     * @todo check
     */
    // this.listeners.on(button, 'click', (event) => {
    button.addEventListener('click', (event) => {
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
    /**
     * Enable shortcuts
     * Ignore tool that doesn't have shortcut or empty string
     */
    const tool = this.tools.get(toolName);

    /**
     * @todo check
     */
    // /**
    //  * 1) For internal tools, check public getter 'shortcut'
    //  * 2) For external tools, check tool's settings
    //  * 3) If shortcut is not set in settings, check Tool's public property
    //  */
    // const internalTools = Tools.internal.inlineTools;
    //
    // if (Array.from(internalTools.keys()).includes(toolName)) {
    //   return this.inlineTools[toolName][CommonInternalSettings.Shortcut];
    // }

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
        /**
         * @todo check
         */
        // const { currentBlock } = this.Editor.BlockManager;
        //
        // /**
        //  * Editor is not focused
        //  */
        // if (!currentBlock) {
        //   return;
        // }

        /**
         * @todo check
         */
        // if (!currentBlock.tool.enabledInlineTools) {
        //   return;
        // }

        event.preventDefault();
        this.toolClicked(tool);
      },
      /**
       * @todo check
       */
      on: this.ownerElement as HTMLElement,
      // on: this.Editor.UI.nodes.redactor,
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
      .from(this.tools.entries())
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
      allowArrows: false,
    });
  }
}
