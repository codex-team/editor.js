'use strict';

import { EditorConfig } from '../types';

/**
 * Apply polyfills
 */
import '@babel/register';

import './components/polyfills';
import Core from './components/core';
import * as _ from './components/utils';
import { destroy as destroyTooltip } from './components/utils/tooltip';

declare const VERSION: string;

/**
 * Editor.js
 *
 * @license Apache-2.0
 * @see Editor.js <https://editorjs.io>
 * @author CodeX Team <https://codex.so>
 */
export default class EditorJS {
  /**
   * Promise that resolves when core modules are ready and UI is rendered on the page
   */
  public isReady: Promise<void>;

  /**
   * Stores destroy method implementation.
   * Clear heap occupied by Editor and remove UI components from the DOM.
   */
  public destroy: () => void;

  /** Editor version */
  public static get version(): string {
    return VERSION;
  }

  /**
   * @param {EditorConfig|string|undefined} [configuration] - user configuration
   */
  constructor(configuration?: EditorConfig|string) {
    /**
     * Set default onReady function
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let onReady = (): void => {};

    /**
     * If `onReady` was passed in `configuration` then redefine onReady function
     */
    if (_.isObject(configuration) && _.isFunction(configuration.onReady)) {
      onReady = configuration.onReady;
    }

    /**
     * Create a Editor.js instance
     */
    const editor = new Core(configuration);

    /**
     * We need to export isReady promise in the constructor
     * as it can be used before other API methods are exported
     *
     * @type {Promise<void>}
     */
    this.isReady = editor.isReady.then(() => {
      this.exportAPI(editor);
      /**
       * @todo pass API as an argument. It will allow to use Editor's API when editor is ready
       */
      onReady();
    });
  }

  /**
   * Export external API methods
   *
   * @param {Core} editor — Editor's instance
   */
  public exportAPI(editor: Core): void {
    const fieldsToExport = [ 'configuration' ];
    const destroy = (): void => {
      Object.values(editor.moduleInstances)
        .forEach((moduleInstance) => {
          if (_.isFunction(moduleInstance.destroy)) {
            moduleInstance.destroy();
          }
          moduleInstance.listeners.removeAll();
        });

      destroyTooltip();

      editor = null;

      for (const field in this) {
        if (Object.prototype.hasOwnProperty.call(this, field)) {
          delete this[field];
        }
      }

      Object.setPrototypeOf(this, null);
    };

    fieldsToExport.forEach((field) => {
      this[field] = editor[field];
    });

    this.destroy = destroy;

    Object.setPrototypeOf(this, editor.moduleInstances.API.methods);

    delete this.exportAPI;

    const shorthands = {
      blocks: {
        clear: 'clear',
        render: 'render',
      },
      caret: {
        focus: 'focus',
      },
      events: {
        on: 'on',
        off: 'off',
        emit: 'emit',
      },
      saver: {
        save: 'save',
      },
    };

    Object.entries(shorthands)
      .forEach(([key, methods]) => {
        Object.entries(methods)
          .forEach(([name, alias]) => {
            this[alias] = editor.moduleInstances.API.methods[key][name];
          });
      });
  }
}
