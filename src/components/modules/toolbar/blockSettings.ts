import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import SelectionUtils from '../../selection';
import Block from '../../block';
import Popover from '../../utils/popover';

/**
 * HTML Elements that used for BlockSettings
 */
interface BlockSettingsNodes {
  wrapper: HTMLElement;
  toolSettings: HTMLElement;
}

/**
 * Block Settings
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 *
 *  @todo Make Block Settings no-module but a standalone class, like Toolbox
 */
export default class BlockSettings extends Module<BlockSettingsNodes> {
  /**
   * Module Events
   *
   * @returns {{opened: string, closed: string}}
   */
  public get events(): { opened: string; closed: string } {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  /**
   * Block Settings CSS
   *
   * @returns {{wrapper}}
   */
  public get CSS(): { [name: string]: string } {
    return {
      // Settings Panel
      wrapper: 'ce-settings',
    };
  }

  /**
   * Opened state
   */
  public opened = false;

  /**
   * Page selection utils
   */
  private selection: SelectionUtils = new SelectionUtils();

  /**
   * Popover instance. There is a util for vertical lists.
   */
  private popover: Popover;

  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', this.CSS.wrapper);
  }

  /**
   * Destroys module
   */
  public destroy(): void {
    this.removeAllNodes();
  }

  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   */
  public open(targetBlock: Block = this.Editor.BlockManager.currentBlock): void {
    this.opened = true;

    /**
     * If block settings contains any inputs, focus will be set there,
     * so we need to save current selection to restore it after block settings is closed
     */
    this.selection.save();

    /**
     * Highlight content of a Block we are working with
     */
    targetBlock.selected = true;
    this.Editor.BlockSelection.clearCache();

    /**
     * Fill Tool's settings
     */
    this.nodes.toolSettings = targetBlock.renderSettings();

    /** Tell to subscribers that block settings is opened */
    this.eventsDispatcher.emit(this.events.opened);

    this.makeToolTunesButtonsNavigatable();

    this.popover = new Popover({
      className: '',
      searchable: true,
      filterLabel: 'Filter',
      nothingFoundLabel: 'Nothing found',
      items: targetBlock.getTunesItems(),
      customContent: this.nodes.toolSettings,
    });

    this.nodes.wrapper.append(this.popover.getElement());

    this.popover.show();
  }

  /**
   * Returns root block settings element
   */
  public getElement(): HTMLElement {
    return this.nodes.wrapper;
  }

  /**
   * Close Block Settings pane
   */
  public close(): void {
    this.opened = false;

    /**
     * If selection is at editor on Block Settings closing,
     * it means that caret placed at some editable element inside the Block Settings.
     * Previously we have saved the selection, then open the Block Settings and set caret to the input
     *
     * So, we need to restore selection back to Block after closing the Block Settings
     */
    if (!SelectionUtils.isAtEditor) {
      this.selection.restore();
    }

    this.selection.clearSaved();

    /**
     * Remove highlighted content of a Block we are working with
     */
    if (!this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockManager.currentBlock.selected = false;
    }

    /** Clear settings */
    if (this.nodes.toolSettings) {
      this.nodes.toolSettings.innerHTML = '';
    }

    /** Tell to subscribers that block settings is closed */
    this.eventsDispatcher.emit(this.events.closed);

    if (this.popover) {
      this.popover.getElement().remove();
    }
  }

  /**
   * Adds special class to rendered tool settings signalising that button should
   * be available for keyboard navigation
   */
  private makeToolTunesButtonsNavigatable(): void {
    const { StylesAPI } = this.Editor;
    const toolSettings = this.nodes.toolSettings?.querySelectorAll(
      // Select buttons and inputs
      `.${StylesAPI.classes.settingsButton}, ${$.allInputsSelector}`
    );

    if (!toolSettings) {
      return;
    }

    toolSettings.forEach((item) => {
      item.classList.add(Popover.CSS.itemFlippable);
    });
  }
}
