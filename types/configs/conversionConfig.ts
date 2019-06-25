import {BlockToolData} from '../tools';

export interface ConversionConfig {
  /**
   * import description
   */
  import: ((data: string) => string) | string;

  /**
   * export description
   */
  export: ((data: BlockToolData) => string) | string;
}
