import Module from '../../__module';
import $ from '../../dom';

/**
 *
 * «Toolbar» is the node that moves up/down over current block
 *
 *  ______________________________________ Toolbar ____________________________________________
 * |                                                                                           |
 * |  ..................... Content ....................   ......... Block Actions ..........  |
 * |  .                                                .   .                                .  |
 * |  .                                                .   .        [Open Settings]         .  |
 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]    .   .                                .  |
 * |  .                                                .   .        [Settings Panel]        .  |
 * |  ..................................................   ..................................  |
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
 * @property {Object} nodes
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
export default class Toolbar extends Module {
  public nodes: {
    wrapper: HTMLElement,
    content: HTMLElement,
    actions: HTMLElement,
    plusButton: HTMLElement,
    blockActionsButtons: HTMLElement,
    settingsToggler: HTMLElement,
  };

  /**
   * @constructor
   */
  constructor({config}) {
    super({config});

    this.nodes = {
      wrapper : null,
      content : null,
      actions : null,

      // Content Zone
      plusButton : null,

      // Actions Zone
      blockActionsButtons: null,
      settingsToggler : null,
    };
  }

  /**
   * CSS styles
   * @return {Object}
   * @constructor
   */
  static get CSS() {
    return {
      toolbar: 'ce-toolbar',
      content: 'ce-toolbar__content',
      actions: 'ce-toolbar__actions',

      toolbarOpened: 'ce-toolbar--opened',

      // Content Zone
      plusButton: 'ce-toolbar__plus',
      plusButtonHidden: 'ce-toolbar__plus--hidden',

      // Actions Zone
      blockActionsButtons: 'ce-toolbar__actions-buttons',
      settingsToggler: 'ce-toolbar__settings-btn',
    };
  }

  /**
   * Makes toolbar
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', Toolbar.CSS.toolbar);

    /**
     * Make Content Zone and Actions Zone
     */
    ['content',  'actions'].forEach( (el) => {
      this.nodes[el] = $.make('div', Toolbar.CSS[el]);
      $.append(this.nodes.wrapper, this.nodes[el]);
    });

    /**
     * Fill Content Zone:
     *  - Plus Button
     *  - Toolbox
     */
    this.nodes.plusButton = $.make('div', Toolbar.CSS.plusButton);
    $.append(this.nodes.plusButton, $.svg('plus', 14, 14));
    $.append(this.nodes.content, this.nodes.plusButton);
    this.Editor.Listeners.on(this.nodes.plusButton, 'click', () => this.plusButtonClicked(), false);

    /**
     * Make a Toolbox
     */
    this.Editor.Toolbox.make();

    /**
     * Fill Actions Zone:
     *  - Settings Toggler
     *  - Remove Block Button
     *  - Settings Panel
     */
    this.nodes.blockActionsButtons = $.make('div', Toolbar.CSS.blockActionsButtons);
    this.nodes.settingsToggler  = $.make('span', Toolbar.CSS.settingsToggler);
    const settingsIcon = $.svg('dots', 18, 4);

    $.append(this.nodes.settingsToggler, settingsIcon);
    $.append(this.nodes.blockActionsButtons, this.nodes.settingsToggler);
    $.append(this.nodes.actions, this.nodes.blockActionsButtons);

    /**
     * Make and append Settings Panel
     */
    this.Editor.BlockSettings.make();
    $.append(this.nodes.actions, this.Editor.BlockSettings.nodes.wrapper);

    /**
     * Append toolbar to the Editor
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    /**
     * Bind events on the Toolbar elements
     */
    this.bindEvents();
  }

  /**
   * Move Toolbar to the Current Block
   * @param {Boolean} forceClose - force close Toolbar Settings and Toolbar
   */
  public move(forceClose: boolean = true): void {
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

    /**
     * Set Toolbar Min Height as Block's height
     * Plus Button and Toolbox positioned at the center of the Toolbar
     */
    const contentOffset = Math.floor(currentBlock.offsetHeight / 2);

    this.nodes.plusButton.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
    this.Editor.Toolbox.nodes.toolbox.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
    /**
     * Move Toolbar to the Top coordinate of Block
     */
    this.nodes.wrapper.style.transform = `translate3D(0, ${Math.floor(currentBlock.offsetTop)}px, 0)`;
  }

  /**
   * Open Toolbar with Plus Button
   */
  public open(): void {
    /**
     * Wait Block rendering for correct height computing
     */
    setTimeout(() => {
      this.move();
      this.nodes.wrapper.classList.add(Toolbar.CSS.toolbarOpened);
    }, 50);
  }

  /**
   * returns toolbar opened state
   * @return {Boolean}
   */
  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(Toolbar.CSS.toolbarOpened);
  }

  /**
   * Close the Toolbar
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(Toolbar.CSS.toolbarOpened);

    /** Close components */
    this.Editor.Toolbox.close();
    this.Editor.BlockSettings.close();
  }

  /**
   * Plus Button public methods
   * @return {{hide: function(): void, show: function(): void}}
   */
  public get plusButton(): {hide: () => void, show: () => void} {
    return {
      hide: () => this.nodes.plusButton.classList.add(Toolbar.CSS.plusButtonHidden),
      show: () => {
        if (this.Editor.Toolbox.isEmpty) {
          return;
        }
        this.nodes.plusButton.classList.remove(Toolbar.CSS.plusButtonHidden);
      },
    };
  }

  /**
   * Handler for Plus Button
   * @param {MouseEvent} event
   */
  private plusButtonClicked(): void {
    this.Editor.Toolbox.toggle();
  }

  /**
   * Bind events on the Toolbar Elements:
   * - Block Settings
   */
  private bindEvents(): void {
    /**
     * Settings toggler
     */
    this.Editor.Listeners.on(this.nodes.settingsToggler, 'click', () => this.settingsTogglerClicked());
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
}
