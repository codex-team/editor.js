/**
 * @module API
 * @copyright <CodeX Team> 2018
 *
 * Each block has an Editor API instance to use public methods
 *
 *
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
   *
   * @param {Object} Editor - module can set editor public methods
   */
  set state(Editor: any) {
    this.Editor = {
      moveDownBlock: this.moveDownBlock,
      moveUpBlock: this.moveUpBlock,
    };
  }

  /**
   * Doing something
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Moves block up
   */
  public moveUpBlock(): void {
    console.log('moving up');
  }

  public moveDownBlock(): void {
    console.log('moving down');
  }
}
