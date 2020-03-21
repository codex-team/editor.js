import {BlockToolData, ToolConfig} from '../tools';
import {SavedData} from '../../src/types-internal/block-data';

/**
 * @interface BlockAPI Describes Block API methods and properties
 */
export interface BlockAPI {
  /**
   * Tool name
   */
  readonly name: string;

  /**
   * Tool config passed on Editor's initialization
   */
  readonly settings: ToolConfig;

  /**
   * .ce-block element, that wraps plugin contents
   */
  readonly holder: HTMLElement;

  /**
   * Tool contents holder, returned from Tool's render() method
   */
  readonly pluginsContent: HTMLElement;

  /**
   * Saved Block data
   */
  readonly data: Promise<BlockToolData>;

  /**
   * True if Tool has merge method
   */
  readonly mergeable: boolean;

  /**
   * True if Block content is empty
   */
  readonly isEmpty: boolean;

  /**
   * True if Block has media
   */
  readonly hasMedia: boolean;

  /**
   * True if Block is selected with Cross-Block selection
   */
  readonly selected: boolean;

  /**
   * True if caret at Block
   */
  readonly focused: boolean;

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
