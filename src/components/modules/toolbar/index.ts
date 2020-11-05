import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';

/**
 * HTML Elements used for Toolbar UI
 */
interface ToolbarNodes {
  wrapper: HTMLElement;
  content: HTMLElement;
  actions: HTMLElement;

  // Content Zone
  plusButton: HTMLElement;

  // Actions Zone
  blockActionsButtons: HTMLElement;
  settingsToggler: HTMLElement;
}
/**
 *
 * «Toolbar» is the node that moves up/down over current block
 *
 *  ______________________________________ Toolbar ____________________________________________
 * |                                                                                           |
 * |  ..................... Content .........................................................  |
 * |  .                                                   ........ Block Actions ...........   |
 * |  .                                                   .        [Open Settings]         .   |
 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]       .                                .   |
 * |  .                                                   .        [Settings Panel]        .   |
 * |  .                                                   ..................................   |
 * |  .......................................................................................  |
 * |                                                                                           |
 * |___________________________________________________________________________________________|
 *
 *
 * Toolbox — its an Element contains tools buttons. Can be shown by Plus Button.
 *
 *  _______________ Toolbox _______________
 * |                                       |
 * | [Header] [Image] [List] [Quote] ...   |
 * |_______________________________________|
 *
 *
 * Settings Panel — is an Element with block settings:
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 *
 *
 * @class
 * @classdesc Toolbar module
 *
 * @typedef {Toolbar} Toolbar
 * @property {object} nodes - Toolbar nodes
 * @property {Element} nodes.wrapper        - Toolbar main element
 * @property {Element} nodes.content        - Zone with Plus button and toolbox.
 * @property {Element} nodes.actions        - Zone with Block Settings and Remove Button
 * @property {Element} nodes.blockActionsButtons   - Zone with Block Buttons: [Settings]
 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
 * @property {Element} nodes.toolbox        - Container for tools
 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
 * @property {Element} nodes.settings          - Settings Panel
 * @property {Element} nodes.pluginSettings    - Plugin Settings section of Settings Panel
 * @property {Element} nodes.defaultSettings   - Default Settings section of Settings Panel
 */
export default class Toolbar extends Module<ToolbarNodes> {
  /**
   * CSS styles
   *
   * @returns {object}
   */
  public get CSS(): { [name: string]: string } {
    return {
      toolbar: 'ce-toolbar',
      content: 'ce-toolbar__content',
      actions: 'ce-toolbar__actions',
      actionsOpened: 'ce-toolbar__actions--opened',

      toolbarOpened: 'ce-toolbar--opened',

      // Content Zone
      plusButton: 'ce-toolbar__plus',
      plusButtonShortcut: 'ce-toolbar__plus-shortcut',
      plusButtonHidden: 'ce-toolbar__plus--hidden',

      // Actions Zone
      blockActionsButtons: 'ce-toolbar__actions-buttons',
      settingsToggler: 'ce-toolbar__settings-btn',
    };
  }

  /**
   * Returns the Toolbar opening state
   *
   * @returns {boolean}
   */
  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened);
  }

  /**
   * Plus Button public methods
   *
   * @returns {{hide: function(): void, show: function(): void}}
   */
  public get plusButton(): { hide: () => void; show: () => void } {
    return {
      hide: (): void => this.nodes.plusButton.classList.add(this.CSS.plusButtonHidden),
      show: (): void => {
        if (this.Editor.Toolbox.isEmpty) {
          return;
        }
        this.nodes.plusButton.classList.remove(this.CSS.plusButtonHidden);
      },
    };
  }

  /**
   * Block actions appearance manipulations
   *
   * @returns {{hide: function(): void, show: function(): void}}
   */
  private get blockActions(): { hide: () => void; show: () => void } {
    return {
      hide: (): void => {
        this.nodes.actions.classList.remove(this.CSS.actionsOpened);
      },
      show: (): void => {
        this.nodes.actions.classList.add(this.CSS.actionsOpened);
      },
    };
  }

  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.drawUI();
      this.enableModuleBindings();
    } else {
      this.destroy();
      this.Editor.Toolbox.destroy();
      this.Editor.BlockSettings.destroy();
      this.disableModuleBindings();
    }
  }

  /**
   * Move Toolbar to the Current Block
   *
   * @param {boolean} forceClose - force close Toolbar Settings and Toolbar
   */
  public move(forceClose = true): void {
    if (forceClose) {
      /** Close Toolbox when we move toolbar */
      this.Editor.Toolbox.close();
      this.Editor.BlockSettings.close();
    }

    const currentBlock = this.Editor.BlockManager.currentBlock.holder;

    /**
     * If no one Block selected as a Current
     */
    if (!currentBlock) {
      return;
    }

    const { isMobile } = this.Editor.UI;
    const blockHeight = currentBlock.offsetHeight;
    let toolbarY = currentBlock.offsetTop;

    /**
     * 1) On desktop — Toolbar at the top of Block, Plus/Toolbox moved the center of Block
     * 2) On mobile — Toolbar at the bottom of Block
     */
    if (!isMobile) {
      const contentOffset = Math.floor(blockHeight / 2);

      this.nodes.plusButton.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
      this.Editor.Toolbox.nodes.toolbox.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
    } else {
      toolbarY += blockHeight;
    }

    /**
     * Move Toolbar to the Top coordinate of Block
     */
    this.nodes.wrapper.style.transform = `translate3D(0, ${Math.floor(toolbarY)}px, 0)`;
  }

  /**
   * Open Toolbar with Plus Button and Actions
   *
   * @param {boolean} withBlockActions - by default, Toolbar opens with Block Actions.
   *                                     This flag allows to open Toolbar without Actions.
   * @param {boolean} needToCloseToolbox - by default, Toolbar will be moved with opening
   *                                      (by click on Block, or by enter)
   *                                      with closing Toolbox and Block Settings
   *                                      This flag allows to open Toolbar with Toolbox
   */
  public open(withBlockActions = true, needToCloseToolbox = true): void {
    _.delay(() => {
      this.move(needToCloseToolbox);
      this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

      if (withBlockActions) {
        this.blockActions.show();
      } else {
        this.blockActions.hide();
      }
    }, 50)();
  }

  /**
   * Close the Toolbar
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(this.CSS.toolbarOpened);

    /** Close components */
    this.blockActions.hide();
    this.Editor.Toolbox.close();
    this.Editor.BlockSettings.close();
  }

  /**
   * Draws Toolbar elements
   */
  private make(): void {
    this.nodes.wrapper = $.make('div', this.CSS.toolbar);

    /**
     * Make Content Zone and Actions Zone
     */
    ['content', 'actions'].forEach((el) => {
      this.nodes[el] = $.make('div', this.CSS[el]);
    });

    /**
     * Actions will be included to the toolbar content so we can align in to the right of the content
     */
    $.append(this.nodes.wrapper, this.nodes.content);
    $.append(this.nodes.content, this.nodes.actions);

    /**
     * Fill Content Zone:
     *  - Plus Button
     *  - Toolbox
     */
    this.nodes.plusButton = $.make('div', this.CSS.plusButton);
    $.append(this.nodes.plusButton, $.svg('plus', 14, 14));
    $.append(this.nodes.content, this.nodes.plusButton);

    this.readOnlyMutableListeners.on(this.nodes.plusButton, 'click', () => {
      this.plusButtonClicked();
    }, false);

    /**
     * Add events to show/hide tooltip for plus button
     */
    const tooltipContent = $.make('div');

    tooltipContent.appendChild(document.createTextNode(I18n.ui(I18nInternalNS.ui.toolbar.toolbox, 'Add')));
    tooltipContent.appendChild($.make('div', this.CSS.plusButtonShortcut, {
      textContent: '⇥ Tab',
    }));

    this.Editor.Tooltip.onHover(this.nodes.plusButton, tooltipContent);

    /**
     * Fill Actions Zone:
     *  - Settings Toggler
     *  - Remove Block Button
     *  - Settings Panel
     */
    this.nodes.blockActionsButtons = $.make('div', this.CSS.blockActionsButtons);
    this.nodes.settingsToggler = $.make('span', this.CSS.settingsToggler);
    const settingsIcon = $.svg('dots', 8, 8);

    $.append(this.nodes.settingsToggler, settingsIcon);
    $.append(this.nodes.blockActionsButtons, this.nodes.settingsToggler);
    $.append(this.nodes.actions, this.nodes.blockActionsButtons);

    this.Editor.Tooltip.onHover(
      this.nodes.settingsToggler,
      I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune'),
      {
        placement: 'top',
      }
    );

    /**
     * Appending Toolbar components to itself
     */
    $.append(this.nodes.content, this.Editor.Toolbox.nodes.toolbox);
    $.append(this.nodes.actions, this.Editor.BlockSettings.nodes.wrapper);

    /**
     * Append toolbar to the Editor
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Handler for Plus Button
   */
  private plusButtonClicked(): void {
    this.Editor.Toolbox.toggle();
  }

  /**
   * Enable bindings
   */
  private enableModuleBindings(): void {
    /**
     * Settings toggler
     */
    this.readOnlyMutableListeners.on(this.nodes.settingsToggler, 'click', () => {
      this.settingsTogglerClicked();
    });
  }

  /**
   * Disable bindings
   */
  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  /**
   * Clicks on the Block Settings toggler
   */
  private settingsTogglerClicked(): void {
    if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else {
      this.Editor.BlockSettings.open();
    }
  }

  /**
   * Draws Toolbar UI
   *
   * Toolbar contains BlockSettings and Toolbox.
   * Thats why at first we draw its components and then Toolbar itself
   *
   * Steps:
   *  - Make Toolbar dependent components like BlockSettings, Toolbox and so on
   *  - Make itself and append dependent nodes to itself
   *
   */
  private drawUI(): void {
    /**
     * Make BlockSettings Panel
     */
    this.Editor.BlockSettings.make();

    /**
     * Make Toolbox
     */
    this.Editor.Toolbox.make();

    /**
     * Make Toolbar
     */
    this.make();
  }

  /**
   * Removes all created and saved HTMLElements
   * It is used in Read-Only mode
   */
  private destroy(): void {
    this.removeAllNodes();
  }
}
