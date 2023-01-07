import Dom from '../../../dom';
import { IconDotCircle } from '@codexteam/icons';

import './styles.css'; // not working

export interface PopoverItemParams {
  /** Popover item icon svg */
  icon?: string;

  /** Popover item title */
  title?: string;

  /** Popover item secondary title */
  secondaryLabel?: string;

  /** True if popover item should be highlighted as active */
  isActive?: boolean;

  /** True if popover item should be marked as disabled */
  isDisabled?: boolean;

  /**  */
  toggle?: boolean;

  /** Popover item name. Used for testing purposes */
  cyName?: string;

  onActivate: (item: PopoverItemParams, event?: PointerEvent) => void;
}


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
    return this.params.toggle;
  }

  /** Item root html element */
  private element: HTMLElement;

  /**  */
  private params: PopoverItemParams;

  /**
   * Popover item CSS classes
   */
  public static get CSS(): {
    container: string,
    title: string,
    secondaryTitle: string,
    icon: string,
    isActive: string,
    isDisabled: string,
    isFocused: string
    } {
    return {
      container: 'codex-popover-item',
      title: 'codex-popover-item__title',
      secondaryTitle: 'codex-popover-item__secondary-title',
      icon: 'codex-popover-item__icon',
      isActive: 'codex-popover-item--active',
      isDisabled: 'codex-popover-item--disabled',
      isFocused: 'codex-popover-item--focused',
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
  public onActivate(event: PointerEvent): void {
    this.params.onActivate(this.params, event);
  }

  /**
   * Toggles item active state
   */
  public toggleActive(): void {
    this.element.classList.toggle(PopoverItemNode.CSS.isActive);
  }

  /**
   * Constructs HTML element corresponding to popover item
   *
   * @param params - item construction params
   */
  private make(params: PopoverItemParams): HTMLElement {
    const el = Dom.make('div', PopoverItemNode.CSS.container);

    if (params.cyName) {
      el.dataset.cyName = params.cyName;
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
}
