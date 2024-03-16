import Dom from '../../dom';
import { IconDotCircle, IconChevronRight } from '@codexteam/icons';
import { PopoverItem as PopoverItemParams } from '../../../../types';

/**
 * Represents sigle popover item node
 */
export class PopoverItem {
  /**
   * True if item is disabled and hence not clickable
   */
  public get isDisabled(): boolean {
    return !!this.params.isDisabled;
  }

  /**
   * Exposes popover item toggle parameter
   */
  public get toggle(): boolean | string | undefined {
    return this.params.toggle;
  }

  /**
   * Item title
   */
  public get title(): string | undefined {
    return this.params.title;
  }

  /**
   * True if popover should close once item is activated
   */
  public get closeOnActivate(): boolean | undefined {
    return this.params.closeOnActivate;
  }

  /**
   * True if confirmation state is enabled for popover item
   */
  public get isConfirmationStateEnabled(): boolean {
    return this.confirmationState !== null;
  }

  /**
   * True if item is focused in keyboard navigation process
   */
  public get isFocused(): boolean {
    if (this.nodes.root === null) {
      return false;
    }

    return this.nodes.root.classList.contains(PopoverItem.CSS.focused);
  }

  /**
   * Item html elements
   */
  private nodes: {
    root: null | HTMLElement,
    icon: null | HTMLElement
  } = {
      root: null,
      icon: null,
    };

  /**
   * Popover item params
   */
  private params: PopoverItemParams;

  /**
   * If item is in confirmation state, stores confirmation params such as icon, label, onActivate callback and so on
   */
  private confirmationState: PopoverItemParams | null = null;

  /**
   * Popover item CSS classes
   */
  public static get CSS(): { [key: string]: string } {
    return {
      container: 'ce-popover-item',
      title: 'ce-popover-item__title',
      secondaryTitle: 'ce-popover-item__secondary-title',
      icon: 'ce-popover-item__icon',
      iconTool: 'ce-popover-item__icon--tool',
      iconChevronRight: 'ce-popover-item__icon--chevron-right',
      active: 'ce-popover-item--active',
      disabled: 'ce-popover-item--disabled',
      focused: 'ce-popover-item--focused',
      hidden: 'ce-popover-item--hidden',
      confirmationState: 'ce-popover-item--confirmation',
      noHover: 'ce-popover-item--no-hover',
      noFocus: 'ce-popover-item--no-focus',
      wobbleAnimation: 'wobble',
    };
  }

  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   */
  constructor(params: PopoverItemParams) {
    this.params = params;
    this.nodes.root = this.make(params);
  }

  /**
   * Returns popover item root element
   */
  public getElement(): HTMLElement | null {
    return this.nodes.root;
  }

  /**
   * Called on popover item click
   */
  public handleClick(): void {
    if (this.isConfirmationStateEnabled && this.confirmationState !== null) {
      this.activateOrEnableConfirmationMode(this.confirmationState);

      return;
    }

    this.activateOrEnableConfirmationMode(this.params);
  }

  /**
   * Toggles item active state
   *
   * @param isActive - true if item should strictly should become active
   */
  public toggleActive(isActive?: boolean): void {
    this.nodes.root?.classList.toggle(PopoverItem.CSS.active, isActive);
  }

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(PopoverItem.CSS.hidden, isHidden);
  }

  /**
   * Resets popover item to its original state
   */
  public reset(): void {
    if (this.isConfirmationStateEnabled) {
      this.disableConfirmationMode();
    }
  }

  /**
   * Method called once item becomes focused during keyboard navigation
   */
  public onFocus(): void {
    this.disableSpecialHoverAndFocusBehavior();
  }

  /**
   * Returns list of item children
   */
  public get children(): PopoverItemParams[] {
    return 'children' in this.params && this.params.children !== undefined ?
      this.params.children.items :
      [];
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

    this.nodes.icon = Dom.make('div', [PopoverItem.CSS.icon, PopoverItem.CSS.iconTool], {
      innerHTML: params.icon || IconDotCircle,
    });

    el.appendChild(this.nodes.icon);

    el.appendChild(Dom.make('div', PopoverItem.CSS.title, {
      innerHTML: params.title || '',
    }));

    if (params.secondaryLabel) {
      el.appendChild(Dom.make('div', PopoverItem.CSS.secondaryTitle, {
        textContent: params.secondaryLabel,
      }));
    }

    if (this.children.length > 0) {
      el.appendChild(Dom.make('div', [PopoverItem.CSS.icon, PopoverItem.CSS.iconChevronRight], {
        innerHTML: IconChevronRight,
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
   * @param newState - new popover item params that should be applied
   */
  private enableConfirmationMode(newState: PopoverItemParams): void {
    if (this.nodes.root === null) {
      return;
    }

    const params = {
      ...this.params,
      ...newState,
      confirmation: newState.confirmation,
    } as PopoverItemParams;
    const confirmationEl = this.make(params);

    this.nodes.root.innerHTML = confirmationEl.innerHTML;
    this.nodes.root.classList.add(PopoverItem.CSS.confirmationState);

    this.confirmationState = newState;

    this.enableSpecialHoverAndFocusBehavior();
  }

  /**
   * Returns item to its original state
   */
  private disableConfirmationMode(): void {
    if (this.nodes.root === null) {
      return;
    }
    const itemWithOriginalParams = this.make(this.params);

    this.nodes.root.innerHTML = itemWithOriginalParams.innerHTML;
    this.nodes.root.classList.remove(PopoverItem.CSS.confirmationState);

    this.confirmationState = null;

    this.disableSpecialHoverAndFocusBehavior();
  }

  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  private enableSpecialHoverAndFocusBehavior(): void {
    this.nodes.root?.classList.add(PopoverItem.CSS.noHover);
    this.nodes.root?.classList.add(PopoverItem.CSS.noFocus);

    this.nodes.root?.addEventListener('mouseleave', this.removeSpecialHoverBehavior, { once: true });
  }

  /**
   * Disables special focus and hover behavior
   */
  private disableSpecialHoverAndFocusBehavior(): void  {
    this.removeSpecialFocusBehavior();
    this.removeSpecialHoverBehavior();

    this.nodes.root?.removeEventListener('mouseleave', this.removeSpecialHoverBehavior);
  }

  /**
   * Removes class responsible for special focus behavior on an item
   */
  private removeSpecialFocusBehavior = (): void => {
    this.nodes.root?.classList.remove(PopoverItem.CSS.noFocus);
  };

  /**
   * Removes class responsible for special hover behavior on an item
   */
  private removeSpecialHoverBehavior = (): void => {
    this.nodes.root?.classList.remove(PopoverItem.CSS.noHover);
  };

  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   */
  private activateOrEnableConfirmationMode(item: PopoverItemParams): void {
    if (item.confirmation === undefined) {
      try {
        item.onActivate?.(item);
        this.disableConfirmationMode();
      } catch {
        this.animateError();
      }
    } else {
      this.enableConfirmationMode(item.confirmation);
    }
  }

  /**
   * Animates item which symbolizes that error occured while executing 'onActivate()' callback
   */
  private animateError(): void {
    if (this.nodes.icon?.classList.contains(PopoverItem.CSS.wobbleAnimation)) {
      return;
    }

    this.nodes.icon?.classList.add(PopoverItem.CSS.wobbleAnimation);

    this.nodes.icon?.addEventListener('animationend', this.onErrorAnimationEnd);
  }

  /**
   * Handles finish of error animation
   */
  private onErrorAnimationEnd = (): void => {
    this.nodes.icon?.classList.remove(PopoverItem.CSS.wobbleAnimation);
    this.nodes.icon?.removeEventListener('animationend', this.onErrorAnimationEnd);
  };
}
