import type { ConversionConfig } from '@/types/configs/conversion-config';
import ToolMock from './ToolMock';

/**
 * This tool has a conversionConfig, but it doesn't have export property.
 *
 * That means that tool can be created from string, but can't be converted to string.
 */
export class ToolWithoutConversionExport extends ToolMock {
  /**
   * Rules specified how our Tool can be converted to/from other Tool.
   */
  public static get conversionConfig(): ConversionConfig {
    return {
      import: 'text', // this tool can be created from string

      /**
       * Here is no "export" property, so this tool can't be converted to string
       */
      // export: (data) => data.text,
    };
  }
}
