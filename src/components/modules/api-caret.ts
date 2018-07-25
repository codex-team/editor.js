declare var Module: any;

import {ICaretAPI} from '../interfaces/api';
import IModuleConfig from '../interfaces/module-config';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module implements ICaretAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {ICaretAPI}
   */
  get methods(): ICaretAPI {
    return {
      isAtEnd: () => this.isAtEnd(),
      set: (element: HTMLElement, offset?: number) => this.set(element, offset),
    };
  }

  /**
   * Set caret to the provided element;
   *
   * @param {HTMLElement} element
   * @param {number} offset
   */
  public set(element: HTMLElement, offset = 0): void {
    this.Editor.Caret.set(element, offset);
  }

  public isAtEnd(): boolean {
    return this.Editor.Caret.isAtEnd;
  }
}
