import Dom from '../../../dom';
import { IconDotCircle } from '@codexteam/icons';
import { PopoverItem as PopoverItemParams} from '../../../../../types';

/**
 * Represents sigle popover item node
 */
export class PopoverItem {
  /** True if item is disabled and hence not clickable */
  public get isDisabled(): boolean {
    return this.params.isDisabled;
  }

  /** Exposes popover item toggle parameter */
  public get toggle(): boolean | string | undefined {
    return this.params.toggle;
  }

  /** Item title */
  public get title(): string | undefined {
    return this.params.title;
  }

  /** True if popover should close once item is activated */
  public get closeOnActivate(): boolean | undefined {
    return this.params.closeOnActivate;
  }

  /** True if popover item is in confirmation state */
  public get isInConfirmationState(): boolean {
    return this.confirmationState !== null;
  }

  /** Item root html element */
  private element: HTMLElement;

  /** Popover item params */
  private params: PopoverItemParams;

  /** If item is in confirmation state, stores confirmation params such as icon, label, onActivate callback and so on */
  private confirmationState: PopoverItemParams | null = null;

  /** Popover item CSS classes */
  public static get CSS(): {
    container: string,
    title: string,
    secondaryTitle: string,
    icon: string,
    active: string,
    disabled: string,
    focused: string,
    hidden: string,
    confirmationState: string,
    noHover: string,
    noFocus: string
    } {
    return {
      container: 'codex-popover-item',
      title: 'codex-popover-item__title',
      secondaryTitle: 'codex-popover-item__secondary-title',
      icon: 'codex-popover-item__icon',
      active: 'codex-popover-item--active',
      disabled: 'codex-popover-item--disabled',
      focused: 'codex-popover-item--focused',
      hidden: 'codex-popover-item--hidden',
      confirmationState: 'codex-popover-item--confirmation',
      noHover: 'codex-popover-item--no-hover',
      noFocus: 'codex-popover-item--no-focus',
    };
  }

  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   */
  constructor(params: PopoverItemParams) {
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
    if (this.isInConfirmationState) {
      this.activateOrEnableConfirmationMode(this.confirmationState, event);
      this.disableConfirmationMode();

      return;
    }

    this.activateOrEnableConfirmationMode(this.params, event);
  }

  /**
   * Toggles item active state
   *
   * @param isActive - true if item should strictly should become active
   */
  public toggleActive(isActive?: boolean): void {
    this.element.classList.toggle(PopoverItem.CSS.active, isActive);
  }

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public toggleHidden(isHidden: boolean): void {
    this.element.classList.toggle(PopoverItem.CSS.hidden, isHidden);
  }

  /**
   * Resets popover item to its original state
   */
  public reset(): void {
    this.disableConfirmationMode();
  }

  /**
   * Method called on popover keyboard navigation
   */
  public onFlip(): void {
    this.disableSpecialHoverAndFocusBehavior();
  }

  /**
   * Constructs HTML element corresponding to popover item params
   *
   * @param params - item construction params
   */
  private make(params: PopoverItemParams): HTMLElement {
    const el = Dom.make('div', PopoverItem.CSS.container);

    if (params.name) {
      el.dataset.itemName = params.name;
    }

    el.appendChild(Dom.make('div', PopoverItem.CSS.icon, {
      innerHTML: params.icon || IconDotCircle,
    }));

    el.appendChild(Dom.make('div', PopoverItem.CSS.title, {
      innerHTML: params.title || '',
    }));

    if (params.secondaryLabel) {
      el.appendChild(Dom.make('div', PopoverItem.CSS.secondaryTitle, {
        textContent: params.secondaryLabel,
      }));
    }

    if (params.isActive) {
      el.classList.add(PopoverItem.CSS.active);
    }

    if (params.isDisabled) {
      el.classList.add(PopoverItem.CSS.disabled);
    }

    return el;
  }

  /**
   * Activates confirmation mode for the item.
   *
   * @param newState -
   */
  private enableConfirmationMode(newState: PopoverItemParams): void {
    const params = {
      ...this.params,
      ...newState,
      confirmation: newState.confirmation,
    } as PopoverItemParams;
    const confirmationEl = this.make(params);

    this.element.innerHTML = confirmationEl.innerHTML;
    this.element.classList.add(PopoverItem.CSS.confirmationState);

    this.confirmationState = newState;

    this.enableSpecialHoverAndFocusBehavior();
  }

  /**
   * Returns item to its original state
   */
  private disableConfirmationMode(): void {
    const itemWithOriginalParams = this.make(this.params);

    this.element.innerHTML = itemWithOriginalParams.innerHTML;
    this.element.classList.remove(PopoverItem.CSS.confirmationState);

    this.confirmationState = null;

    this.disableSpecialHoverAndFocusBehavior();
  }

  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  private enableSpecialHoverAndFocusBehavior(): void {
    this.element.classList.add(PopoverItem.CSS.noHover);
    this.element.classList.add(PopoverItem.CSS.noFocus);

    this.element.addEventListener('mouseleave', this.removeSpecialHoverBehavior, { once: true });
  }

  /**
   * Disables special focus and hover behavior
   */
  private disableSpecialHoverAndFocusBehavior(): void  {
    this.removeSpecialFocusBehavior();
    this.removeSpecialHoverBehavior();

    this.element.removeEventListener('mouseleave', this.removeSpecialHoverBehavior);
  }

  /**
   * Removes class responsible for special focus behavior on an item
   */
  private removeSpecialFocusBehavior = (): void => {
    this.element.classList.remove(PopoverItem.CSS.noFocus);
  };

  /**
   * Removes class responsible for special hover behavior on an item
   */
  private removeSpecialHoverBehavior = (): void => {
    this.element.classList.remove(PopoverItem.CSS.noHover);
  };

  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   * @param event - click event
   */
  private activateOrEnableConfirmationMode(item: PopoverItemParams, event: PointerEvent): void {
    if (item.confirmation === undefined) {
      item.onActivate(item, event);
    } else {
      this.enableConfirmationMode(item.confirmation);
    }
  }
}
