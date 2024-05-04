import { PopoverItem } from '../popover-item';
import { PopoverItemCustomParams } from '../popover-item.types';
import { css } from './popover-item-custom.const';
import Dom from '../../../../../dom';

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
      root: Dom.make('div', css.root),
    };

    this.nodes.root.appendChild(params.element);
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

  /**
   * Returns list of buttons and inputs inside custom content
   */
  public getControls(): HTMLElement[] {
    /** Query buttons and inputs inside custom html */
    const controls = this.nodes.root.querySelectorAll<HTMLElement>(
      `button, ${Dom.allInputsSelector}`
    );

    return Array.from(controls);
  }
}
