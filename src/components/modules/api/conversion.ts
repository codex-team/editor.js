import { Conversion as ConversionAPIInterface } from '../../../../types/api';
import Module from '../../__module';

/**
 * Provides with methods for converting one block to another
 */
export default class ConversionAPI extends Module {
  /**
   * Available methods
   *
   * @returns {ConversionAPIInterface}
   */
  public get methods(): ConversionAPIInterface {
    return {
      getItemsForBlock: (block) => this.Editor.Conversion.getItemsForBlock(block),
    };
  }
}
