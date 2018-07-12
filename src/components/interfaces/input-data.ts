/**
 * Interface represents input CodeX Editor data
 * that passed with initial configuration object as 'data' key
 */
export default interface IInputData {
  /**
   * Saved Blocks
   */
  readonly items: object[];

  /**
   * Article id. Optional
   */
  readonly id?: number|string;
}
