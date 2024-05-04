import { PopoverItem } from '../popover-item';
import { PopoverItemCustomParams } from '../popover-item.types';
import { css } from './popover-item-custom.const';

/**
 * Represents popover item with custom html content
 */
export class PopoverItemCustom extends PopoverItem {
  /**
   * Item html elements
   */
  private nodes: { root: HTMLElement };

  /**
   * Constructs the instance
   *
   * @param params – instance parameters
   */
  constructor(params: PopoverItemCustomParams) {
    super();

    this.nodes = {
      root: params.element,
    };
  }

  /**
   * Returns popover item root element
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
