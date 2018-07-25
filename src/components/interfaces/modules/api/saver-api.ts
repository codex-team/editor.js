import IInputOutputData from '../../input-output-data';

/**
 * Saver's methods
 */
export default interface ISaverAPI {

  /**
   * Return current blocks
   *
   * @return {IInputOutputData}
   */
  save: () => IInputOutputData;
}
