import { Hint } from '../hint/hint';
import * as tooltip from '../../../../utils/tooltip';
import { HintPosition } from './popover-item.types';

/**
 * Popover item abstract class
 */
export abstract class PopoverItem {
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
}
