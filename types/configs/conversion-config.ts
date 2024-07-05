import type { BlockToolData } from '../tools';

/**
 * Config allows Tool to specify how it can be converted into/from another Tool
 */
export interface ConversionConfig {
  /**
   * How to import string to this Tool.
   *
   * Can be a String or Function:
   *
   * 1. String — the key of Tool data object to fill it with imported string on render.
   * 2. Function — method that accepts importing string and composes Tool data to render.
   */
  import?: ((data: string) => string) | string;

  /**
   * How to export this Tool to make other Block.
   *
   * Can be a String or Function:
   *
   * 1. String — which property of saved Tool data should be used as exported string.
   * 2. Function — accepts saved Tool data and create a string to export
   */
  export?: ((data: BlockToolData) => string) | string;
}
