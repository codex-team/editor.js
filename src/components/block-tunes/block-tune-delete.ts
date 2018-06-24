/**
 * @class DeleteTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import IBlockTune from './block-tune';

declare var $: any;
declare var _: any;

export default class DeleteTune implements IBlockTune {

  /**
   * Property that contains CodeX Editor API methods
   * @see {docs/api.md}
   */
  private readonly api: any;

  /**
   * Styles
   * @type {{wrapper: string}}
   */
  private CSS = {
    wrapper: 'ass',
  };

  /**
   * Delete confirmation
   */
  private needConfirmation: boolean;

  /**
   * DeleteTune constructor
   *
   * @param {Object} api
   */
  public constructor({api}) {
    this.api = api;

    this.resetConfirmation = () => {
      this.setConfirmation(false);
    };
  }

  /**
   * change tune state
   */
  private setConfirmation(state): void {
    this.needConfirmation = state;
  }

  /**
   * set false confirmation state
   */
  private resetConfirmation: () => void;

  /**
   * Create "Delete" button and add click event listener
   * @returns [Element}
   */
  public render() {
    const deleteButton = $.make('div', ['ce-settings-delete'], {});
    deleteButton.addEventListener('click', (event) => this.handleClick(event), false);
    return deleteButton;
  }

  /**
   * Delete block conditions passed
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent): void {

    /**
     * if block is not waiting the confirmation, subscribe on block-settings-closing event to reset
     * otherwise delete block
     */
    if (!this.needConfirmation) {
      this.setConfirmation(true);

      /**
       * Subscribe on event.
       * When toolbar block settings is closed but block deletion is not confirmed,
       * then reset confirmation state
       */
      this.api.events.on('block-settings-closed', this.resetConfirmation);

    } else {

      /**
       * Unsubscribe from block-settings closing event
       */
      this.api.events.off('block-settings-closed', this.resetConfirmation);

      this.api.blocks.delete();
    }
  }
}
