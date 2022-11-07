/**
 * Tool onPaste configuration object
 */
export interface PasteConfig {
  /**
   * Array of tags Tool can substitute. 
   * 
   * Could also contain a sanitise-config if you need to save some tag's attribute. 
   * For example: 
   * [
   *   { 
   *     img: { src: true },
   *   }
   * ],
   * @type string[]
   */
  tags?: (string | object)[];

  /**
   * Object of string patterns Tool can substitute.
   * Key is your internal key and value is RegExp
   *
   * @type {{[key: string]: Regexp}}
   */
  patterns?: {[key: string]: RegExp};

  /**
   * Object with arrays of extensions and MIME types Tool can substitute
   */
  files?: {extensions?: string[], mimeTypes?: string[]};
}
