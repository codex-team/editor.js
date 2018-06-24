/**
 * @class MoveUpTune
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
   * MoveUpTune constructor
   *
   * @param {Object} api
   */
  public constructor({api}) {
    this.api = api;
  }

  /**
   * Create "MoveUp" button and add click event listener
   * @returns [Element}
   */
  public render() {
    const deleteButton = $.make('div', ['ce-settings-delete'], {});
    deleteButton.addEventListener('click', (event) => this.handleClick(event), false);
    return deleteButton;
  }

  /**
   * Move current block up
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent): void {
    if (!this.needConfirmation) {
      this.needConfirmation = true;
      console.log("hey");
    } else {
      this.api.blocks.delete();
    }

  }
}
