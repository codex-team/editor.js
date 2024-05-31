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
   * Destroys the instance
   */
  public destroy(): void {
    tooltip.hide();
  }

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

  /**
   * Returns true if item has children that should be searchable
   */
  public get isChildrenSearchable(): boolean {
    return 'children' in this.params && this.params.children?.searchable === true;
  }

  /**
   * True if popover should close once item is activated
   */
  public get closeOnActivate(): boolean | undefined {
    return this.params.closeOnActivate;
  }

  /**
   * True if item is active
   */
  public get isActive(): boolean {
    return this.params.isActive;
  }
}
