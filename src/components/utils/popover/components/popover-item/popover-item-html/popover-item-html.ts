import { PopoverItem } from '../popover-item';
import { PopoverItemHtmlParams, PopoverItemRenderParamsMap, PopoverItemType } from '../popover-item.types';
import { css } from './popover-item-html.const';
import Dom from '../../../../../dom';

/**
 * Represents popover item with custom html content
 */
export class PopoverItemHtml extends PopoverItem {
  /**
   * Item html elements
   */
  private nodes: { root: HTMLElement };

  /**
   * Constructs the instance
   *
   * @param params – instance parameters
   * @param renderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(params: PopoverItemHtmlParams, renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Html]) {
    super(params);

    this.nodes = {
      root: Dom.make('div', css.root),
    };

    this.nodes.root.appendChild(params.element);

    if (params.name) {
      this.nodes.root.dataset.itemName = params.name;
    }

    if (params.hint !== undefined && renderParams?.hint?.enabled !== false) {
      this.addHint(this.nodes.root, {
        ...params.hint,
        position: renderParams?.hint?.position || 'right',
      });
    }
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
