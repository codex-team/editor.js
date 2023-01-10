import Dom from '../../../dom';
import { IconDotCircle } from '@codexteam/icons';

import './styles.css'; // not working
import { PopoverItem } from '../../../../../types';

// export interface PopoverItemParams {
//   /** Popover item icon svg */
//   icon?: string;

//   /** Popover item title */
//   title?: string;

//   /** Popover item secondary title */
//   secondaryLabel?: string;

//   /** True if popover item should be highlighted as active */
//   isActive?: boolean;

//   /** True if popover item should be marked as disabled */
//   isDisabled?: boolean;

//   /**  */
//   toggle?: boolean;

//   /** Popover item name. Used for testing purposes */
//   cyName?: string;

//   onActivate: (item: PopoverItemParams, event?: PointerEvent) => void;
// }


/**
 * Represents sigle popover item node
 */
export class PopoverItemNode {
  /** True if item is disabled and hence not clickable */
  public get isDisabled(): boolean {
    return this.params.isDisabled;
  }

  /** */
  public get toggle(): boolean {
    return this.params.toggle === true;
  }

  /** True if popover item is in confirmation state */
  public get isInConfirmationState(): boolean {
    return true;
  }

  /** Item root html element */
  private element: HTMLElement;

  /**  */
  private params: PopoverItem;

  /**  */
  private confirmationState: PopoverItem | null;

  /** Popover item CSS classes */
  public static get CSS(): {
    container: string,
    title: string,
    secondaryTitle: string,
    icon: string,
    isActive: string,
    isDisabled: string,
    isFocused: string,
    confirmationState: string
    } {
    return {
      container: 'codex-popover-item',
      title: 'codex-popover-item__title',
      secondaryTitle: 'codex-popover-item__secondary-title',
      icon: 'codex-popover-item__icon',
      isActive: 'codex-popover-item--active',
      isDisabled: 'codex-popover-item--disabled',
      isFocused: 'codex-popover-item--focused',
      confirmationState: 'codex-popover-item--confirmation',
    };
  }

  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   */
  constructor(params: PopoverItem) {
    this.params = params;
    this.element = this.make(params);
  }

  /**
   * Returns popover item root element
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Called on popover item click
   *
   * @param event - click event
   */
  public handleClick(event: PointerEvent): void {
    if (this.params.confirmation === undefined) {
      this.params.onActivate(this.params, event);
    } else {
      this.enableConfirmationMode(this.params.confirmation);
    }
  }

  /**
   * Toggles item active state
   */
  public toggleActive(): void {
    this.element.classList.toggle(PopoverItemNode.CSS.isActive);
  }

  /**
   * Resets popover item to its original state
   */
  public reset(): void {
    this.disableConfirmationMode();
  }

  /**
   * Constructs HTML element corresponding to popover item
   *
   * @param params - item construction params
   */
  private make(params: PopoverItem): HTMLElement {
    const el = Dom.make('div', PopoverItemNode.CSS.container);

    if (params.name) {
      el.dataset.name = params.name;
    }

    el.appendChild(Dom.make('div', PopoverItemNode.CSS.icon, {
      innerHTML: params.icon || IconDotCircle,
    }));

    el.appendChild(Dom.make('div', PopoverItemNode.CSS.title, {
      innerHTML: params.title || '',
    }));

    if (params.secondaryLabel) {
      el.appendChild(Dom.make('div', PopoverItemNode.CSS.secondaryTitle, {
        textContent: params.secondaryLabel,
      }));
    }

    if (params.isActive) {
      el.classList.add(PopoverItemNode.CSS.isActive);
    }

    if (params.isDisabled) {
      el.classList.add(PopoverItemNode.CSS.isDisabled);
    }

    return el;
  }

  /**
   * Activates confirmation mode for the item.
   *
   * @param newState
   */
  private enableConfirmationMode(newState: PopoverItem): void {
    const params = {
      ...this.params,
      ...newState,
      confirmation: newState.confirmation,
    } as PopoverItem;
    const confirmationEl = this.make(params);

    this.element.innerHTML = confirmationEl.innerHTML;
    this.element.classList.add(PopoverItemNode.CSS.confirmationState);
  }

  /**
   *
   */
  private disableConfirmationMode(): void {
    const itemWithOriginalParams = this.make(this.params);

    this.element.innerHTML = itemWithOriginalParams.innerHTML;
    this.element.classList.remove(PopoverItemNode.CSS.confirmationState);
  }
}
