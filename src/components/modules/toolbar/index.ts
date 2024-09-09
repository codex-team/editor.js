import Module from '../../__module';
import $, { calculateBaseline } from '../../dom';
import * as _ from '../../utils';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import * as tooltip from '../../utils/tooltip';
import type { ModuleConfig } from '../../../types-internal/module-config';
import type Block from '../../block';
import Toolbox, { ToolboxEvent } from '../../ui/toolbox';
import { IconMenu, IconPlus } from '@codexteam/icons';
import { BlockHovered } from '../../events/BlockHovered';
import { beautifyShortcut } from '../../utils';
import { getKeyboardKeyForCode } from '../../utils/keyboard';

/**
 * @todo Tab on non-empty block should open Block Settings of the hoveredBlock (not where caret is set)
 *          - make Block Settings a standalone module
 * @todo - Keyboard-only mode bug:
 *         press Tab, flip to the Checkbox. press Enter (block will be added), Press Tab
 *         (Block Tunes will be opened with Move up focused), press Enter, press Tab ———— both Block Tunes and Toolbox will be opened
 * @todo TEST CASE - show toggler after opening and closing the Inline Toolbar
 * @todo TEST CASE - Click outside Editor holder should close Toolbar and Clear Focused blocks
 * @todo TEST CASE - Click inside Editor holder should close Toolbar and Clear Focused blocks
 * @todo TEST CASE - Click inside Redactor zone when Block Settings are opened:
 *                  - should close Block Settings
 *                  - should not close Toolbar
 *                  - should move Toolbar to the clicked Block
 * @todo TEST CASE - Toolbar should be closed on the Cross Block Selection
 * @todo TEST CASE - Toolbar should be closed on the Rectangle Selection
 * @todo TEST CASE - If Block Settings or Toolbox are opened, the Toolbar should not be moved by Bocks hovering
 */

/**
 * HTML Elements used for Toolbar UI
 */
interface ToolbarNodes {
  wrapper: HTMLElement | undefined;
  content: HTMLElement | undefined;
  actions: HTMLElement | undefined;

  plusButton: HTMLElement | undefined;
  settingsToggler: HTMLElement | undefined;
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
   * Block near which we display the Toolbox
   */
  private hoveredBlock: Block;

  /**
   * Toolbox class instance
   * It will be created in requestIdleCallback so it can be null in some period of time
   */
  private toolboxInstance: Toolbox | null = null;

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

      plusButton: 'ce-toolbar__plus',
      plusButtonShortcut: 'ce-toolbar__plus-shortcut',
      settingsToggler: 'ce-toolbar__settings-btn',
      settingsTogglerHidden: 'ce-toolbar__settings-btn--hidden',
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
   * Public interface for accessing the Toolbox
   */
  public get toolbox(): {
    opened: boolean | undefined; // undefined is for the case when Toolbox is not initialized yet
    close: () => void;
    open: () => void;
    toggle: () => void;
    hasFocus: () => boolean | undefined;
    } {
    return {
      opened: this.toolboxInstance?.opened,
      close: () => {
        this.toolboxInstance?.close();
      },
      open: () => {
        /**
         * If Toolbox is not initialized yet, do nothing
         */
        if (this.toolboxInstance === null)  {
          _.log('toolbox.open() called before initialization is finished', 'warn');

          return;
        }

        /**
         * Set current block to cover the case when the Toolbar showed near hovered Block but caret is set to another Block.
         */
        this.Editor.BlockManager.currentBlock = this.hoveredBlock;

        this.toolboxInstance.open();
      },
      toggle: () => {
        /**
         * If Toolbox is not initialized yet, do nothing
         */
        if (this.toolboxInstance === null)  {
          _.log('toolbox.toggle() called before initialization is finished', 'warn');

          return;
        }

        this.toolboxInstance.toggle();
      },
      hasFocus: () => this.toolboxInstance?.hasFocus(),
    };
  }

  /**
   * Block actions appearance manipulations
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
   * Methods for working with Block Tunes toggler
   */
  private get blockTunesToggler(): { hide: () => void; show: () => void } {
    return {
      hide: (): void => this.nodes.settingsToggler.classList.add(this.CSS.settingsTogglerHidden),
      show: (): void => this.nodes.settingsToggler.classList.remove(this.CSS.settingsTogglerHidden),
    };
  }


  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      window.requestIdleCallback(() => {
        this.drawUI();
        this.enableModuleBindings();
      }, { timeout: 2000 });
    } else {
      this.destroy();
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
     * Some UI elements creates inside requestIdleCallback, so the can be not ready yet
     */
    if (this.toolboxInstance === null)  {
      _.log('Can\'t open Toolbar since Editor initialization is not finished yet', 'warn');

      return;
    }

    /**
     * Close Toolbox when we move toolbar
     */
    if (this.toolboxInstance.opened) {
      this.toolboxInstance.close();
    }

    if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    }

    /**
     * If no one Block selected as a Current
     */
    if (!block) {
      return;
    }

    this.hoveredBlock = block;

    const targetBlockHolder = block.holder;
    const { isMobile } = this.Editor.UI;


    /**
     * 1. Mobile:
     *  - Toolbar at the bottom of the block
     *
     * 2. Desktop:
     *   There are two cases of a toolbar position:
     *      2.1 Toolbar is moved to the top of the block (+ padding top of the block)
     *       - when the first input is far from the top of the block, for example in Image tool
     *       - when block has no inputs
     *      2.2 Toolbar is moved to the baseline of the first input
     *       - when the first input is close to the top of the block
     */
    let toolbarY;
    const MAX_OFFSET = 20;

    /**
     * Compute first input position
     */
    const firstInput = block.firstInput;
    const targetBlockHolderRect = targetBlockHolder.getBoundingClientRect();
    const firstInputRect = firstInput !== undefined ? firstInput.getBoundingClientRect() : null;

    /**
     * Compute the offset of the first input from the top of the block
     */
    const firstInputOffset = firstInputRect !== null ? firstInputRect.top - targetBlockHolderRect.top : null;

    /**
     * Check if the first input is far from the top of the block
     */
    const isFirstInputFarFromTop = firstInputOffset !== null ? firstInputOffset > MAX_OFFSET : undefined;

    /**
     * Case 1.
     * On mobile — Toolbar at the bottom of Block
     */
    if (isMobile) {
      toolbarY = targetBlockHolder.offsetTop + targetBlockHolder.offsetHeight;

    /**
     * Case 2.1
     * On Desktop — without inputs or with the first input far from the top of the block
     *            Toolbar should be moved to the top of the block
     */
    } else if (firstInput === undefined || isFirstInputFarFromTop) {
      const pluginContentOffset = parseInt(window.getComputedStyle(block.pluginsContent).paddingTop);

      const paddingTopBasedY = targetBlockHolder.offsetTop + pluginContentOffset;

      toolbarY = paddingTopBasedY;

    /**
     * Case 2.2
     * On Desktop — Toolbar should be moved to the baseline of the first input
     */
    } else {
      const baseline = calculateBaseline(firstInput);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const toolbarActionsHeight =  parseInt(window.getComputedStyle(this.nodes.plusButton!).height, 10);
      /**
       * Visual padding inside the SVG icon
       */
      const toolbarActionsPaddingBottom = 8;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const baselineBasedY = targetBlockHolder.offsetTop + baseline - toolbarActionsHeight + toolbarActionsPaddingBottom + firstInputOffset!;

      toolbarY = baselineBasedY;
    }

    /**
     * Move Toolbar to the Top coordinate of Block
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.nodes.wrapper!.style.top = `${Math.floor(toolbarY)}px`;

    /**
     * Do not show Block Tunes Toggler near single and empty block
     */
    if (this.Editor.BlockManager.blocks.length === 1 && block.isEmpty) {
      this.blockTunesToggler.hide();
    } else {
      this.blockTunesToggler.show();
    }

    this.open();
  }

  /**
   * Close the Toolbar
   */
  public close(): void {
    if (this.Editor.ReadOnly.isEnabled) {
      return;
    }

    this.nodes.wrapper?.classList.remove(this.CSS.toolbarOpened);

    /** Close components */
    this.blockActions.hide();
    this.toolboxInstance?.close();
    this.Editor.BlockSettings.close();
    this.reset();
  }

  /**
   * Reset the Toolbar position to prevent DOM height growth, for example after blocks deletion
   */
  private reset(): void {
    this.nodes.wrapper.style.top = 'unset';
  }

  /**
   * Open Toolbar with Plus Button and Actions
   *
   * @param {boolean} withBlockActions - by default, Toolbar opens with Block Actions.
   *                                     This flag allows to open Toolbar without Actions.
   */
  private open(withBlockActions = true): void {
    this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

    if (withBlockActions) {
      this.blockActions.show();
    } else {
      this.blockActions.hide();
    }
  }

  /**
   * Draws Toolbar elements
   */
  private async make(): Promise<void> {
    this.nodes.wrapper = $.make('div', this.CSS.toolbar);
    /**
     * @todo detect test environment and add data-cy="toolbar" to use it in tests instead of class name
     */

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
    this.nodes.plusButton = $.make('div', this.CSS.plusButton, {
      innerHTML: IconPlus,
    });
    $.append(this.nodes.actions, this.nodes.plusButton);

    this.readOnlyMutableListeners.on(this.nodes.plusButton, 'click', () => {
      tooltip.hide(true);
      this.plusButtonClicked();
    }, false);

    /**
     * Add events to show/hide tooltip for plus button
     */
    const tooltipContent = $.make('div');

    tooltipContent.appendChild(document.createTextNode(I18n.ui(I18nInternalNS.ui.toolbar.toolbox, 'Add')));
    tooltipContent.appendChild($.make('div', this.CSS.plusButtonShortcut, {
      textContent: '/',
    }));

    tooltip.onHover(this.nodes.plusButton, tooltipContent, {
      hidingDelay: 400,
    });

    /**
     * Fill Actions Zone:
     *  - Settings Toggler
     *  - Remove Block Button
     *  - Settings Panel
     */
    this.nodes.settingsToggler = $.make('span', this.CSS.settingsToggler, {
      innerHTML: IconMenu,
    });

    $.append(this.nodes.actions, this.nodes.settingsToggler);

    const blockTunesTooltip = $.make('div');
    const blockTunesTooltipEl = $.text(I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune'));
    const slashRealKey = await getKeyboardKeyForCode('Slash', '/');

    blockTunesTooltip.appendChild(blockTunesTooltipEl);
    blockTunesTooltip.appendChild($.make('div', this.CSS.plusButtonShortcut, {
      textContent: beautifyShortcut(`CMD + ${slashRealKey}`),
    }));

    tooltip.onHover(this.nodes.settingsToggler, blockTunesTooltip, {
      hidingDelay: 400,
    });

    /**
     * Appending Toolbar components to itself
     */
    $.append(this.nodes.actions, this.makeToolbox());
    $.append(this.nodes.actions, this.Editor.BlockSettings.getElement());

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
      i18nLabels: {
        filter: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
      },
    });

    this.toolboxInstance.on(ToolboxEvent.Opened, () => {
      this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolboxHolderModifier);
    });

    this.toolboxInstance.on(ToolboxEvent.Closed, () => {
      this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolboxHolderModifier);
    });

    this.toolboxInstance.on(ToolboxEvent.BlockAdded, ({ block }) => {
      const { BlockManager, Caret } = this.Editor;
      const newBlock = BlockManager.getBlockById(block.id);

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
    });

    return this.toolboxInstance.getElement();
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

    this.toolboxInstance?.toggle();
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

      if (this.toolboxInstance?.opened) {
        this.toolboxInstance.close();
      }

      tooltip.hide(true);
    }, true);

    /**
     * Subscribe to the 'block-hovered' event if current view is not mobile
     *
     * @see https://github.com/codex-team/editor.js/issues/1972
     */
    if (!_.isMobileScreen()) {
      /**
       * Subscribe to the 'block-hovered' event
       */
      this.eventsDispatcher.on(BlockHovered, (data) => {
        /**
         * Do not move toolbar if Block Settings or Toolbox opened
         */
        if (this.Editor.BlockSettings.opened || this.toolboxInstance?.opened) {
          return;
        }

        this.moveAndOpen(data.block);
      });
    }
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
    void this.make();
  }

  /**
   * Removes all created and saved HTMLElements
   * It is used in Read-Only mode
   */
  private destroy(): void {
    this.removeAllNodes();
    if (this.toolboxInstance) {
      this.toolboxInstance.destroy();
    }
  }
}
