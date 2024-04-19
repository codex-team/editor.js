import Dom from '../../../../../dom';
import { css } from './popover-item-delimiter.const';

/**
 * Represents popover delimiter node
 */
export class PopoverItemDelimiter {
  /**
   * Html elements
   */
  private nodes: { root: HTMLElement; line: HTMLElement };

  /**
   * Constructs the instance
   */
  constructor() {
    this.nodes = {
      root: Dom.make('div', css.container),
      line: Dom.make('div', css.line),
    };

    this.nodes.root.appendChild(this.nodes.line);
  }

  /**
   * Returns popover delimiter root element
   */
  public getElement(): HTMLElement {
    return this.nodes.root;
  }
}
