import Dom from '../../../../dom';
import { css } from './hint.const';
import { HintParams } from './hint.types';

import './hint.css';

/**
 * Represents the hint content component
 */
export class Hint {
  /**
   * Html element used to display hint content on screen
   */
  private nodes: {
    root: HTMLElement;
    title: HTMLElement;
    description?: HTMLElement;
  };

  /**
   * Constructs the hint content instance
   *
   * @param params - hint content parameters
   */
  constructor(params: HintParams) {
    this.nodes = {
      root: Dom.make('div', [css.root, params.alignment === 'center' ? css.alignedCenter : css.alignedStart]),
      title: Dom.make('div', css.title, { textContent: params.title }),
    };

    this.nodes.root.appendChild(this.nodes.title);

    if (params.description !== undefined) {
      this.nodes.description = Dom.make('div', css.description, { textContent: params.description });

      this.nodes.root.appendChild(this.nodes.description);
    }
  }

  /**
   * Returns the root element of the hint content
   */
  public getElement(): HTMLElement {
    return this.nodes.root;
  }
}
