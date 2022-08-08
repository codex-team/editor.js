import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import SelectionUtils from '../../selection';
import Block from '../../block';
import Popover, { PopoverEvent } from '../../utils/popover';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';

/**
 * HTML Elements that used for BlockSettings
 */
interface BlockSettingsNodes {
  wrapper: HTMLElement;
  renderedTunes: HTMLElement;
}

/**
 * Block Settings
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
   */
  public get CSS(): { [name: string]: string } {
    return {
      settings: 'ce-settings',
      settingsOpenedTop: 'ce-settings--opened-top',
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
    this.nodes.wrapper = $.make('div');
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
    const [tunesItemsConfig, addiitionalTunesContainer] = targetBlock.getTunes();

    this.nodes.renderedTunes = addiitionalTunesContainer;

    /** Tell to subscribers that block settings is opened */
    this.eventsDispatcher.emit(this.events.opened);

    this.makeToolTunesButtonsNavigatable();

    this.popover = new Popover({
      className: this.CSS.settings,
      searchable: true,
      filterLabel: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      nothingFoundLabel: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
      items: tunesItemsConfig,
      customContent: this.nodes.renderedTunes,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
    });
    this.popover.on(PopoverEvent.OverlayClicked, this.onOverlayClicked);

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
    if (this.nodes.renderedTunes) {
      this.nodes.renderedTunes.innerHTML = '';
    }

    /** Tell to subscribers that block settings is closed */
    this.eventsDispatcher.emit(this.events.closed);

    if (this.popover) {
      this.popover.off(PopoverEvent.OverlayClicked, this.onOverlayClicked);
      this.popover.destroy();
      this.popover.getElement().remove();
    }
  }

  /**
   * Adds special class to rendered tool settings signalising that button should
   * be available for keyboard navigation
   */
  private makeToolTunesButtonsNavigatable(): void {
    const { StylesAPI } = this.Editor;
    /** Query buttons and inputs inside tunes html */
    const toolSettings = this.nodes.renderedTunes?.querySelectorAll(
      `.${StylesAPI.classes.settingsButton}, ${$.allInputsSelector}`
    );

    if (!toolSettings) {
      return;
    }

    toolSettings.forEach((item) => {
      item.classList.add(Popover.CSS.itemFlippable);
    });
  }

  /**
   * Handles overlay click
   */
  private onOverlayClicked = (): void => {
    this.close();
  }
}
