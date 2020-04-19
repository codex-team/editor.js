/**
 * Structure of the i18n dictionary
 */
export interface I18nDictionary {
  /**
   * Section for translation Tool Names: both block and inline tools
   * Example:
   *  "toolNames": {
   *     "Text": "Параграф",
   *     "Heading": "Заголовок",
   *     "List": "Список",
   *     ...
   *  },
   */
  toolNames?: Dictionary;

  /**
   * Section for passing translations to the external tools classes
   * The first-level keys of this object should be equal of keys ot the 'tools' property of EditorConfig
   * Includes internal tools: "paragraph", "stub"
   *
   * Example:
   *  "tools": {
   *     "warning": {
   *       "Title": "Название",
   *       "Message": "Сообщение",
   *     },
   *     "link": {
   *        "Add a link": "Вставьте ссылку"
   *     },
   *  },
   */
  tools?: Dictionary;

  /**
   * Section allows to translate Block Tunes
   * The first-level keys of this object should be equal of 'name' ot the 'tools.<toolName>.tunes' property of EditorConfig
   * Including some internal block-tunes: "delete", "moveUp", "moveDown
   *
   * Example:
   * "blockTunes": {
   *   "delete": {
   *     "Delete": "Удалить"
   *   },
   *   "moveUp": {
   *     "Move up": "Переместить вверх"
   *   },
   *   "moveDown": {
   *     "Move down": "Переместить вниз"
   *   }
   * },
   */
  blockTunes?: Dictionary;

  /**
   * Translation of internal UI components of the editor.js core
   */
  ui?: Dictionary;
}

/**
 * Represent item of the I18nDictionary config
 */
export interface Dictionary {
  /**
   * The keys of the object can represent two entities:
   *  1. Dictionary key usually is an original string from default locale, like "Convert to"
   *  2. Sub-namespace section, like "toolbar.converter.<...>"
   *
   *  Example of 1:
   *  toolbox: {
   *    "Add": "Добавить",
   *  }
   *
   *  Example of 2:
   *  ui: {
   *    toolbar: {
   *      toolbox: {    <-- Example of 1
   *        "Add": "Добавить"
   *      }
   *    }
   *  }
   */
  [key: string]: DictValue;
}

/**
 * The value of the dictionary can be:
 *  - other dictionary
 *  - result translate string
 */
export type DictValue = {[key: string]: Dictionary | string} | string;

