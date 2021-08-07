import {BlockToolData, ToolConfig} from '../tools';
import {SavedData} from '../data-formats';

/**
 * @interface BlockAPI Describes Block API methods and properties
 */
export interface BlockAPI {
  /**
   * Block unique identifier
   */
  readonly id: string;

  /**
   * Tool name
   */
  readonly name: string;

  /**
   * Tool config passed on Editor's initialization
   */
  readonly config: ToolConfig;

  /**
   * Wrapper of Tool's HTML element
   */
  readonly holder: HTMLElement;

  /**
   * True if Block content is empty
   */
  readonly isEmpty: boolean;

  /**
   * True if Block is selected with Cross-Block selection
   */
  readonly selected: boolean;

  /**
   * Setter sets Block's stretch state
   *
   * Getter returns true if Block is stretched
   */
  stretched: boolean;

  /**
   * Call Tool method with errors handler under-the-hood
   *
   * @param {string} methodName - method to call
   * @param {object} param - object with parameters
   *
   * @return {void}
   */
  call(methodName: string, param?: object): void;

  /**
   * Save Block content
   *
   * @return {Promise<void|SavedData>}
   */
  save(): Promise<void|SavedData>;

  /**
   * Validate Block data
   *
   * @param {BlockToolData} data
   *
   * @return {Promise<boolean>}
   */
  validate(data: BlockToolData): Promise<boolean>;
}
