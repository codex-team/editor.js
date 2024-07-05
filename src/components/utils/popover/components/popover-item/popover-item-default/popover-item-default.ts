import Dom from '../../../../../dom';
import { IconDotCircle, IconChevronRight } from '@codexteam/icons';
import {
  PopoverItemDefaultParams as PopoverItemDefaultParams,
  PopoverItemRenderParamsMap,
  PopoverItemType
} from '../popover-item.types';
import { PopoverItem } from '../popover-item';
import { css } from './popover-item-default.const';

/**
 * Represents sigle popover item node
 *
 * @todo move nodes initialization to constructor
 * @todo replace multiple make() usages with constructing separate instances
 * @todo split regular popover item and popover item with confirmation to separate classes
 * @todo display icon on the right side of the item for rtl languages
 */
export class PopoverItemDefault extends PopoverItem {
  /**
   * True if item is disabled and hence not clickable
   */
  public get isDisabled(): boolean {
    return this.params.isDisabled === true;
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

    return this.nodes.root.classList.contains(css.focused);
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
   * If item is in confirmation state, stores confirmation params such as icon, label, onActivate callback and so on
   */
  private confirmationState: PopoverItemDefaultParams | null = null;

  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   * @param renderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(protected readonly params: PopoverItemDefaultParams, renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Default]) {
    super(params);

    this.nodes.root = this.make(params, renderParams);
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
    this.nodes.root?.classList.toggle(css.active, isActive);
  }

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public override toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(css.hidden, isHidden);
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
   * Constructs HTML element corresponding to popover item params
   *
   * @param params - item construction params
   * @param renderParams - popover item render params
   */
  private make(params: PopoverItemDefaultParams, renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Default]): HTMLElement {
    const tag = renderParams?.wrapperTag || 'div';
    const el = Dom.make(tag, css.container);

    if (params.name) {
      el.dataset.itemName = params.name;
    }

    this.nodes.icon = Dom.make('div', [css.icon, css.iconTool], {
      innerHTML: params.icon || IconDotCircle,
    });

    el.appendChild(this.nodes.icon);

    if (params.title !== undefined) {
      el.appendChild(Dom.make('div', css.title, {
        innerHTML: params.title || '',
      }));
    }

    if (params.secondaryLabel) {
      el.appendChild(Dom.make('div', css.secondaryTitle, {
        textContent: params.secondaryLabel,
      }));
    }

    if (this.hasChildren) {
      el.appendChild(Dom.make('div', [css.icon, css.iconChevronRight], {
        innerHTML: IconChevronRight,
      }));
    }

    if (this.isActive) {
      el.classList.add(css.active);
    }

    if (params.isDisabled) {
      el.classList.add(css.disabled);
    }

    if (params.hint !== undefined && renderParams?.hint?.enabled !== false) {
      this.addHint(el, {
        ...params.hint,
        position: renderParams?.hint?.position || 'right',
      });
    }

    return el;
  }

  /**
   * Activates confirmation mode for the item.
   *
   * @param newState - new popover item params that should be applied
   */
  private enableConfirmationMode(newState: PopoverItemDefaultParams): void {
    if (this.nodes.root === null) {
      return;
    }

    const params = {
      ...this.params,
      ...newState,
      confirmation: 'confirmation' in newState ? newState.confirmation : undefined,
    } as PopoverItemDefaultParams;
    const confirmationEl = this.make(params);

    this.nodes.root.innerHTML = confirmationEl.innerHTML;
    this.nodes.root.classList.add(css.confirmationState);

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
    this.nodes.root.classList.remove(css.confirmationState);

    this.confirmationState = null;

    this.disableSpecialHoverAndFocusBehavior();
  }

  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  private enableSpecialHoverAndFocusBehavior(): void {
    this.nodes.root?.classList.add(css.noHover);
    this.nodes.root?.classList.add(css.noFocus);

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
    this.nodes.root?.classList.remove(css.noFocus);
  };

  /**
   * Removes class responsible for special hover behavior on an item
   */
  private removeSpecialHoverBehavior = (): void => {
    this.nodes.root?.classList.remove(css.noHover);
  };

  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   */
  private activateOrEnableConfirmationMode(item: PopoverItemDefaultParams): void {
    if (!('confirmation' in item) || item.confirmation === undefined) {
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
    if (this.nodes.icon?.classList.contains(css.wobbleAnimation)) {
      return;
    }

    this.nodes.icon?.classList.add(css.wobbleAnimation);

    this.nodes.icon?.addEventListener('animationend', this.onErrorAnimationEnd);
  }

  /**
   * Handles finish of error animation
   */
  private onErrorAnimationEnd = (): void => {
    this.nodes.icon?.classList.remove(css.wobbleAnimation);
    this.nodes.icon?.removeEventListener('animationend', this.onErrorAnimationEnd);
  };
}
