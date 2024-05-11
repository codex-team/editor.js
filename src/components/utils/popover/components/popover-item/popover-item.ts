import * as tooltip from '../../../../utils/tooltip';
import { type HintPosition, Hint } from '../hint';
import { PopoverItemParams } from './popover-item.types';

/**
 * Popover item abstract class
 */
export abstract class PopoverItem {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(protected readonly params?: PopoverItemParams) {}

  /**
   * Adds hint to the item element if hint data is provided
   *
   * @param itemElement - popover item root element to add hint to
   * @param hintData - hint data
   */
  protected addHint(itemElement: HTMLElement, hintData: { title: string, description?: string; position: HintPosition }): void {
    const content = new Hint(hintData);

    tooltip.onHover(itemElement, content.getElement(), {
      placement: hintData.position,
      hidingDelay: 100,
    });
  }

  /**
   * Returns popover item root element
   */
  public abstract getElement(): HTMLElement | null;

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public abstract toggleHidden(isHidden: boolean): void;

  /**
   * Returns item children that are represented as popover items
   */
  public get children(): PopoverItemParams[] {
    return 'children' in this.params && this.params.children?.items !== undefined ? this.params.children.items : [];
  }

  /**
   * Returns true if item has any type of children
   */
  public get hasChildren(): boolean {
    return this.children.length > 0;
  }
}
