import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Tooltip from '../../utils/tooltip';
import { ModuleConfig } from '../../../types-internal/module-config';
import { BlockAPI } from '../../../../types';
import Block from '../../block';
import Toolbox from '../../ui/toolbox';

/**
 * @todo Tab on non-empty block should open Block Settings of the hoveredBlock (not where caret is set)
 *          - make Block Settings a standalone module
 *
 * @todo TESTCASE - show toggler after opening and closing the Inline Toolbar
 * @todo TESTCASE - Click outside Editor holder should close Toolbar and Clear Focused blocks
 * @todo TESTCASE - Click inside Editor holder should close Toolbar and Clear Focused blocks
 * @todo TESTCASE - Click inside Redactor zone when Block Settings are opened:
 *                  - should close Block Settings
 *                  - should not close Toolbar
 *                  - should move Toolbar to the clicked Block
 * @todo TESTCASE - Toolbar should be closed on the Cross Block Selection
 * @todo TESTCASE - Toolbar should be closed on the Rectangle Selection
 * @todo TESTCASE - If Block Settings or Toolbox are opened, the Toolbar should not be moved by Bocks hovering
 */

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
   * Tooltip utility Instance
   */
  private tooltip: Tooltip;

  /**
   * Block near which we display the Toolbox
   */
  private hoveredBlock: Block;

  /**
   * Toolbox class instance
   */
  private toolboxInstance: Toolbox;

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
      openedToolboxHolderModifier: 'codex-editor--toolbox-opened',

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
        if (this.toolboxInstance.isEmpty) {
          return;
        }
        this.nodes.plusButton.classList.remove(this.CSS.plusButtonHidden);
      },
    };
  }

  /**
   * Public interface for accessing the Toolbox
   */
  public get toolbox(): {
    opened: boolean;
    close: () => void;
    open: () => void;
    toggle: () => void;
    flipperHasFocus: boolean;
    } {
    return {
      opened: this.toolboxInstance.opened,
      close: (): void => this.toolboxInstance.close(),
      open: (): void => {
        /**
         * Set current block to cover the case when the Toolbar showed near hovered Block but caret is set to another Block.
         */
        this.Editor.BlockManager.currentBlock = this.hoveredBlock;

        this.toolboxInstance.open();
      },
      toggle: (): void => this.toolboxInstance.toggle(),
      flipperHasFocus: this.toolboxInstance.flipperHasFocus,
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
      this.toolboxInstance.destroy();
      this.Editor.BlockSettings.destroy();
      this.disableModuleBindings();
    }
  }

  /**
   * Move Toolbar to the passed (or current) Block
   *
   * @param block - block to move Toolbar near it
   */
  public moveAndOpen(block: Block = this.Editor.BlockManager.currentBlock): void {
    /**
     * Close Toolbox when we move toolbar
     */
    this.toolboxInstance.close();
    this.Editor.BlockSettings.close();

    const targetBlockHolder = block.holder;

    /**
     * If no one Block selected as a Current
     */
    if (!block) {
      return;
    }

    this.hoveredBlock = block;

    const { isMobile } = this.Editor.UI;
    const renderedContent = block.pluginsContent;
    const renderedContentStyle = window.getComputedStyle(renderedContent);
    const blockRenderedElementPaddingTop = parseInt(renderedContentStyle.paddingTop, 10);
    const blockHeight = targetBlockHolder.offsetHeight;

    let toolbarY;

    /**
     * On mobile — Toolbar at the bottom of Block
     * On Desktop — Toolbar should be moved to the first line of block text
     *              To do that, we compute the block offset and the padding-top of the plugin content
     */
    if (isMobile) {
      toolbarY = targetBlockHolder.offsetTop + blockHeight;
    } else {
      toolbarY = targetBlockHolder.offsetTop + blockRenderedElementPaddingTop;
    }

    /**
     * Move Toolbar to the Top coordinate of Block
     */
    this.nodes.wrapper.style.transform = `translate3D(0, ${Math.floor(toolbarY)}px, 0)`;

    /**
     * Plus Button should be shown only for __empty__ __default__ block
     */
    if (block.tool.isDefault && block.isEmpty) {
      this.plusButton.show();
    } else {
      this.plusButton.hide();
    }

    this.open();
  }

  /**
   * Close the Toolbar
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(this.CSS.toolbarOpened);

    /** Close components */
    this.blockActions.hide();
    this.toolboxInstance.close();
    this.Editor.BlockSettings.close();
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
  private open(withBlockActions = true, needToCloseToolbox = true): void {
    _.delay(() => {
      this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

      if (withBlockActions) {
        this.blockActions.show();
      } else {
        this.blockActions.hide();
      }
    }, 50)();
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
    $.append(this.nodes.plusButton, $.svg('plus', 16, 16));
    $.append(this.nodes.actions, this.nodes.plusButton);

    this.readOnlyMutableListeners.on(this.nodes.plusButton, 'click', () => {
      this.tooltip.hide(true);
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

    this.tooltip.onHover(this.nodes.plusButton, tooltipContent, {
      hidingDelay: 400,
    });

    /**
     * Fill Actions Zone:
     *  - Settings Toggler
     *  - Remove Block Button
     *  - Settings Panel
     */
    this.nodes.blockActionsButtons = $.make('div', this.CSS.blockActionsButtons);
    this.nodes.settingsToggler = $.make('span', this.CSS.settingsToggler);
    const settingsIcon = $.svg('dots', 16, 16);

    $.append(this.nodes.settingsToggler, settingsIcon);
    $.append(this.nodes.blockActionsButtons, this.nodes.settingsToggler);
    $.append(this.nodes.actions, this.nodes.blockActionsButtons);

    this.tooltip.onHover(
      this.nodes.settingsToggler,
      I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune'),
      {
        hidingDelay: 400,
      }
    );

    /**
     * Appending Toolbar components to itself
     */
    $.append(this.nodes.content, this.makeToolbox());
    $.append(this.nodes.actions, this.Editor.BlockSettings.nodes.wrapper);

    /**
     * Append toolbar to the Editor
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Creates the Toolbox instance and return it's rendered element
   */
  private makeToolbox(): Element {
    /**
     * Make the Toolbox
     */
    this.toolboxInstance = new Toolbox({
      api: this.Editor.API.methods,
      tools: this.Editor.Tools.blockTools,
      shortcutsScopeElement: this.Editor.UI.nodes.redactor,
      onOpen: (): void => {
        this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolboxHolderModifier);
      },
      onClose: (): void => {
        this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolboxHolderModifier);
      },
      onBlockAdded: (addedBlockApi: BlockAPI): void => {
        const { BlockManager, Caret } = this.Editor;
        const newBlock = BlockManager.getBlockById(addedBlockApi.id);

        /**
         * If the new block doesn't contain inputs, insert the new paragraph below
         */
        if (newBlock.inputs.length === 0) {
          if (newBlock === BlockManager.lastBlock) {
            BlockManager.insertAtEnd();
            Caret.setToBlock(BlockManager.lastBlock);
          } else {
            Caret.setToBlock(BlockManager.nextBlock);
          }
        }
      },
    });

    return this.toolboxInstance.make();
  }

  /**
   * Handler for Plus Button
   */
  private plusButtonClicked(): void {
    /**
     * We need to update Current Block because user can click on the Plus Button (thanks to appearing by hover) without any clicks on editor
     * In this case currentBlock will point last block
     */
    this.Editor.BlockManager.currentBlock = this.hoveredBlock;

    this.toolboxInstance.toggle();
  }

  /**
   * Enable bindings
   */
  private enableModuleBindings(): void {
    /**
     * Settings toggler
     *
     * mousedown is used because on click selection is lost in Safari and FF
     */
    this.readOnlyMutableListeners.on(this.nodes.settingsToggler, 'mousedown', (e) => {
      /**
       * Stop propagation to prevent block selection clearance
       *
       * @see UI.documentClicked
       */
      e.stopPropagation();

      this.settingsTogglerClicked();

      this.toolboxInstance.close();

      this.tooltip.hide(true);
    }, true);

    /**
     * Subscribe to the 'block-hovered' event
     */
    this.eventsDispatcher.on(this.Editor.UI.events.blockHovered, (data: {block: Block}) => {
      /**
       * Do not move toolbar if Block Settings or Toolbox opened
       */
      if (this.Editor.BlockSettings.opened || this.toolboxInstance.opened) {
        return;
      }

      this.moveAndOpen(data.block);
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
    /**
     * We need to update Current Block because user can click on toggler (thanks to appearing by hover) without any clicks on editor
     * In this case currentBlock will point last block
     */
    this.Editor.BlockManager.currentBlock = this.hoveredBlock;

    if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else {
      this.Editor.BlockSettings.open(this.hoveredBlock);
    }
  }

  /**
   * Draws Toolbar UI
   *
   * Toolbar contains BlockSettings and Toolbox.
   * That's why at first we draw its components and then Toolbar itself
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
    this.toolboxInstance.destroy();
    this.tooltip.destroy();
  }
}
