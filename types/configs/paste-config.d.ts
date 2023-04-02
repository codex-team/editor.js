import { SanitizerConfig } from './sanitizer-config';

/**
 * Tool onPaste configuration object
 */
interface PasteConfigSpecified {
  /**
   * Array of tags Tool can substitute.
   *
   * Could also contain a sanitize-config if you need to save some tag's attribute.
   * For example:
   * [
   *   {
   *     img: { src: true },
   *   }
   * ],
   * @type string[]
   */
  tags?: (string | SanitizerConfig)[];

  /**
   * Object of string patterns Tool can substitute.
   * Key is your internal key and value is RegExp
   *
   * @type {{[key: string]: RegExp}}
   */
  patterns?: {[key: string]: RegExp};

  /**
   * Object with arrays of extensions and MIME types Tool can substitute
   */
  files?: {extensions?: string[], mimeTypes?: string[]};
}

/**
 * Alias for PasteConfig with false
 */
export type PasteConfig = PasteConfigSpecified | false;
