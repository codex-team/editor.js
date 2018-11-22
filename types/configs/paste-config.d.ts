import {BlockToolData} from "../index";


/**
 * Tool onPaste configuration object
 */
export interface PasteConfig {
  /**
   * Array of tags Tool can substitute
   * @type string[]
   */
  tags?: string[];

  /**
   * Handler to process pasted HTML tag
   *
   * @param {HTMLElement} element
   * @return {BlockToolData}
   */
  handler?: (element: HTMLElement) => BlockToolData;

  /**
   * Object of string patterns Tool can substitute.
   * Key is your internal key and value is RegExp
   *
   * @type {{[key: string]: Regexp}}
   */
  patterns?: {[key: string]: RegExp};

  /**
   * Handler to process pasted patterns
   *
   * @param {string} text
   * @param {string} key
   * @return {BlockToolData}
   */
  patternHandler?: (text: string, key: string) => BlockToolData;

  /**
   * Object with arrays of extensions and MIME types Tool can substitute
   */
  files?: {extensions?: string[], mimeTypes?: string[]};

  /**
   * Handler to process pasted files
   *
   * @param {File} file
   * @return {BlockToolData}
   */
  fileHandler?: (file: File) => BlockToolData;
}
