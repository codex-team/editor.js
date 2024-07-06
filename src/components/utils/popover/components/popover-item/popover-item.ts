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
   * Item name if exists
   */
  public get name(): string | undefined {
    if (this.params === undefined) {
      return;
    }
    if ('name' in this.params) {
      return this.params.name;
    }
  }

  /**
   * Destroys the instance
   */
  public destroy(): void {
    tooltip.hide();
  }

  /**
   * Called when children popover is opened (if exists)
   */
  public onChildrenOpen(): void {
    if (this.params === undefined) {
      return;
    }

    if ('children' in this.params && typeof this.params.children?.onOpen === 'function') {
      this.params.children.onOpen();
    }
  }

  /**
   * Called when children popover is closed (if exists)
   */
  public onChildrenClose(): void {
    if (this.params === undefined) {
      return;
    }

    if ('children' in this.params && typeof this.params.children?.onClose === 'function') {
      this.params.children.onClose();
    }
  }

  /**
   * Called on popover item click
   */
  public handleClick(): void {
    if (this.params === undefined) {
      return;
    }

    if (!('onActivate' in this.params)) {
      return;
    }

    this.params.onActivate?.(this.params);
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
    return this.params !== undefined && 'children' in this.params && this.params.children?.items !== undefined ? this.params.children.items : [];
  }

  /**
   * Returns true if item has any type of children
   */
  public get hasChildren(): boolean {
    return this.children.length > 0;
  }

  /**
   * Returns true if item children should be open instantly after popover is opened and not on item click/hover
   */
  public get isChildrenOpen(): boolean {
    return this.params !== undefined && 'children' in this.params && this.params.children?.isOpen === true;
  }

  /**
   * True if item children items should be navigatable via keyboard
   */
  public get isChildrenFlippable(): boolean {
    if (this.params === undefined) {
      return false;
    }

    if (!('children' in this.params)) {
      return false;
    }

    if (this.params.children?.isFlippable === false) {
      return false;
    }

    return true;
  }

  /**
   * Returns true if item has children that should be searchable
   */
  public get isChildrenSearchable(): boolean {
    return this.params !== undefined && 'children' in this.params && this.params.children?.searchable === true;
  }

  /**
   * True if popover should close once item is activated
   */
  public get closeOnActivate(): boolean | undefined {
    return this.params !== undefined && 'closeOnActivate' in this.params && this.params.closeOnActivate;
  }

  /**
   * True if item is active
   */
  public get isActive(): boolean {
    if (this.params === undefined) {
      return false;
    }

    if (!('isActive' in this.params)) {
      return false;
    }

    if (typeof this.params.isActive === 'function') {
      return this.params.isActive();
    }

    return this.params.isActive === true;
  }
}
