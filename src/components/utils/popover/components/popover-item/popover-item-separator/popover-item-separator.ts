import Dom from '../../../../../dom';
import { PopoverItem } from '../popover-item';
import { css } from './popover-item-separator.const';

/**
 * Represents popover separator node
 */
export class PopoverItemSeparator extends PopoverItem {
  /**
   * Html elements
   */
  private nodes: { root: HTMLElement; line: HTMLElement };

  /**
   * Constructs the instance
   */
  constructor() {
    super();

    this.nodes = {
      root: Dom.make('div', css.container),
      line: Dom.make('div', css.line),
    };

    this.nodes.root.appendChild(this.nodes.line);
  }

  /**
   * Returns popover separator root element
   */
  public getElement(): HTMLElement {
    return this.nodes.root;
  }

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(css.hidden, isHidden);
  }
}
