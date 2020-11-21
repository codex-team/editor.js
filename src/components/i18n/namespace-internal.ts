import defaultDictionary from './locales/en/messages.json';
import { DictNamespaces } from '../../types-internal/i18n-internal-namespace';
import { isObject, isString } from '../utils';

/**
 * Evaluate messages dictionary and return object for namespace chaining
 *
 * @param dict - Messages dictionary
 * @param [keyPath] - subsection path (used in recursive call)
 */
function getNamespaces(dict: object, keyPath?: string): DictNamespaces<typeof defaultDictionary> {
  const result = {};

  Object.entries(dict).forEach(([key, section]) => {
    if (isObject(section)) {
      const newPath = keyPath ? `${keyPath}.${key}` : key;

      /**
       * Check current section values, if all of them are strings, so there is the last section
       */
      const isLastSection = Object.values(section).every((sectionValue) => {
        return isString(sectionValue);
      });

      /**
       * In last section, we substitute namespace path instead of object with translates
       *
       * ui.toolbar.toolbox – "ui.toolbar.toolbox"
       * instead of
       * ui.toolbar.toolbox – {"Add": ""}
       */
      if (isLastSection) {
        result[key] = newPath;
      } else {
        result[key] = getNamespaces(section, newPath);
      }

      return;
    }

    result[key] = section;
  });

  return result as DictNamespaces<typeof defaultDictionary>;
}

/**
 * Type safe access to the internal messages dictionary sections
 *
 * @example I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune');
 */
export const I18nInternalNS = getNamespaces(defaultDictionary);
