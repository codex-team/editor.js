/**
 * @module ModificationsObserver
 *
 * Handles any mutations
 * and gives opportunity to handle outside
 */

import IEditorConfig from '../interfaces/editor-config';

declare const Module: any;
declare const $: any;
declare const _: any;

export default class ModificationsObserver extends Module {

  /**
   * Constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

}
