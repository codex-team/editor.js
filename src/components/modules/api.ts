/**
 * @module API
 * @copyright <CodeX Team> 2018
 *
 * Each block has an Editor API instance to use provided public methods
 *
 * if you cant to read more about how API works, please see docs
 */
declare var Module: any;
declare var $: any;
declare var _: any;

/**
 * @class API
 */
export default class API extends Module {

  protected Editor: any;

  /**
   * @param {@link CodexEditor#moduleInstances} Editor - module can set editor public methods
   */
  set state(Editor) {
    this.Editor = {
      block: {
        moveDown: this.moveDownBlock,
        moveUp: this.moveUpBlock,
      },
      caret: {},
      sanitizer: {
        clean: Editor.Sanitizer.clean,
      },
      toolbar: {},
    };
  }

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  public moveDownBlock(): void {
    console.log('moving down');
  }

  /**
   * Moves block up
   */
  public moveUpBlock(): void {
    console.log('moving up');
  }

}
