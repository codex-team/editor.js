import './styles.css'; // not working

import { PopoverItemNode, PopoverItemParams } from './popover-item';
import Dom from '../../dom';
import { cacheable, keyCodes } from '../../utils';
import Flipper from '../../flipper';

interface PopoverParams {
  items: PopoverItemParams[];
  scopeElement?: HTMLElement;
}

/**
 * Class responsible for rendering popover and handling its behaviour
 */
export default class Popover {
  /**
   * Flipper - module for keyboard iteration between elements
   */
  public flipper: Flipper;


  /** List of popover items */
  private items: PopoverItemNode[];

  /** True if popover is open */
  private isOpen = false;

  /**
   * Element of the page that creates 'scope' of the popover.
   * If possible, popover will not cross specified element's borders when opening.
   */
  private scopeElement: HTMLElement = document.body;

  /**
   * Popover CSS classes
   */
  private static get CSS(): {
    popover: string;
    popoverOpenTop: string;
    popoverClosed: string
    } {
    return {
      popover: 'codex-popover',
      popoverOpenTop: 'codex-popover--open-top',
      popoverClosed: 'codex-popover--closed',
    };
  }

  /**
   * Refs to created HTML elements
   */
  private nodes: {
    popover: HTMLElement | null
  } = {
      popover: null,
    };

  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   */
  constructor(params: PopoverParams) {
    this.items = params.items.map(item => new PopoverItemNode(item));

    if (params.scopeElement !== undefined) {
      this.scopeElement = params.scopeElement;
    }

    this.make();
    this.initializeFlipper();
  }

  /**
   * Returns HTML element correcponding to the popover
   */
  public getElement(): HTMLElement | null {
    return this.nodes.popover;
  }

  /**
   * Returns true if some item inside popover is focused
   */
  public hasFocus(): boolean {
    return this.flipper.hasFocus();
  }

  /**
   * Open popover
   */
  public show(): void {
    if (!this.shouldOpenBottom) {
      this.nodes.popover.style.setProperty('--popover-height', this.height + 'px');
      this.nodes.popover.classList.add(Popover.CSS.popoverOpenTop);
    }

    this.nodes.popover.classList.remove(Popover.CSS.popoverClosed);
    this.flipper.activate(this.flippableElements);
    this.isOpen = true;
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover.classList.add(Popover.CSS.popoverClosed);
    this.nodes.popover.classList.remove(Popover.CSS.popoverOpenTop);
    this.flipper.deactivate();
    this.isOpen = false;
  }

  /**
   *
   */
  public destroy(): void {
    //
  }


  /**
   * Constructs HTML element corresponding to popover
   */
  private make(): void {
    this.nodes.popover = Dom.make('div', [Popover.CSS.popover, Popover.CSS.popoverClosed]);

    this.items.forEach(item => {
      this.nodes.popover.appendChild(item.getElement());
    });

    this.nodes.popover.addEventListener('click', (event: PointerEvent) => {
      const item = this.getTargetItem(event);

      this.handleClick(item, event);
    });
  }

  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  private getTargetItem(event: PointerEvent): PopoverItemNode | undefined {
    return this.items.find(el => event.composedPath().includes(el.getElement()));
  }

  /**
   * Handles item clicks
   *
   * @param item - item to handle click of
   * @param event - click event
   */
  private handleClick(item: PopoverItemNode, event: PointerEvent): void {
    if (item === undefined || item.isDisabled) {
      return;
    }

    item.onActivate(event);

    if (item.toggle === true) {
      item.toggleActive();
    }
  }

  /**
   * Creates Flipper instance which allows to navigate between popover items via keyboard
   */
  private initializeFlipper(): void {
    this.flipper = new Flipper({
      items: this.flippableElements,
      focusedItemClass: PopoverItemNode.CSS.isFocused,
      allowedKeys: [
        keyCodes.TAB,
        keyCodes.UP,
        keyCodes.DOWN,
        keyCodes.ENTER,
      ],
    });
  }

  /**
   * Returns list of elements available for keyboard navigation.
   * Contains both usual popover items elements and custom html content.
   */
  private get flippableElements(): HTMLElement[] {
    return this.items.map(item => item.getElement());
  }

  /**
   * Helps to calculate height of popover while it is not displayed on screen.
   * Renders invisible clone of popover to get actual height.
   */
  @cacheable
  private get height(): number {
    let height = 0;

    if (this.nodes.popover === null) {
      return height;
    }

    const popoverClone = this.nodes.popover.cloneNode(true) as HTMLElement;

    popoverClone.style.visibility = 'hidden';
    popoverClone.style.position = 'absolute';
    popoverClone.style.top = '-1000px';
    popoverClone.classList.remove(Popover.CSS.popoverClosed);
    document.body.appendChild(popoverClone);
    height = popoverClone.offsetHeight;
    popoverClone.remove();

    return height;
  }

  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  private get shouldOpenBottom(): boolean {
    const popoverRect = this.nodes.popover.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverHeight = this.height;
    const popoverPotentialBottomEdge = popoverRect.top + popoverHeight;
    const popoverPotentialTopEdge = popoverRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(window.innerHeight, scopeElementRect.bottom);

    return popoverPotentialTopEdge < scopeElementRect.top || popoverPotentialBottomEdge <= bottomEdgeForComparison;
  }
}
