import './styles.css'; // not working

import { PopoverItemNode } from './popover-item';
import Dom from '../../dom';
import { cacheable, keyCodes } from '../../utils';
import Flipper from '../../flipper';
import { PopoverItem } from '../../../../types';
import SearchInput from '../search-input';

interface PopoverParams {
  items: PopoverItem[];
  scopeElement?: HTMLElement;
  searchable?: boolean;
  messages?: PopoverMessages
}

interface PopoverMessages {
  /** Text displayed when search has no results */
  nothingFound?: string;

  /** Search input label */
  search?: string
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

  /** Instance of the Search Input */
  private search: SearchInput | undefined;

  /**
   * Popover CSS classes
   */
  private static get CSS(): {
    popover: string;
    popoverOpenTop: string;
    popoverClosed: string;
    search: string;
    nothingFoundMessage: string;
    nothingFoundMessageDisplayed: string;
    } {
    return {
      popover: 'codex-popover',
      popoverOpenTop: 'codex-popover--open-top',
      popoverClosed: 'codex-popover--closed',
      search: 'codex-popover__search',
      nothingFoundMessage: 'codex-popover__nothing-found-message',
      nothingFoundMessageDisplayed: 'codex-popover__nothing-found-message--displayed',
    };
  }

  /** Refs to created HTML elements */
  private nodes: {
    popover: HTMLElement | null
    nothingFoundMessage: HTMLElement | null
  } = {
      popover: null,
      nothingFoundMessage: null,
    };

  /** Messages that will be displayed in popover */
  private messages: PopoverMessages = {
    nothingFound: 'Nothing found',
    search: 'Search',
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

    if (params.messages) {
      this.messages = {
        ...this.messages,
        ...params.messages,
      };
    }

    this.make();

    if (params.searchable) {
      this.addSearch();
    }

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

    if (this.search !== undefined) {
      setTimeout(() => {
        this.search.focus();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 100);
    }

    this.isOpen = true;
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover.classList.add(Popover.CSS.popoverClosed);
    this.nodes.popover.classList.remove(Popover.CSS.popoverOpenTop);
    this.flipper.deactivate();
    this.items.forEach(item => item.reset());
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

    this.nodes.nothingFoundMessage = Dom.make('div', [ Popover.CSS.nothingFoundMessage ], {
      textContent: this.messages.nothingFound,
    });

    this.nodes.popover.appendChild(this.nodes.nothingFoundMessage);

    this.items.forEach(item => {
      this.nodes.popover.appendChild(item.getElement());
    });

    this.nodes.popover.addEventListener('click', (event: PointerEvent) => {
      const item = this.getTargetItem(event);

      this.handleClick(item, event);
    });
  }

  /**
   * Adds seach to the popover
   */
  private addSearch(): void {
    this.search = new SearchInput({
      items: this.items,
      placeholder: this.messages.search,
      onSearch: (result: PopoverItemNode[]): void => {
        this.items.forEach(item => {
          const isHidden = !result.includes(item);

          item.toggleHidden(isHidden);
        });

        this.toggleNothingFoundMessage(result.length === 0);
      },
    });

    const searchElement = this.search.getElement();

    searchElement.classList.add(Popover.CSS.search);

    this.nodes.popover.insertBefore(searchElement, this.nodes.popover.firstChild);
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

    /** Cleanup other items state */
    this.items.filter(x => x !== item).forEach(x => x.reset());

    item.handleClick(event);

    this.toggleIfNeeded(item);

    if (item.closeOnActivate) {
      this.hide();
    }
  }

  /**
   * Creates Flipper instance which allows to navigate between popover items via keyboard
   */
  private initializeFlipper(): void {
    this.flipper = new Flipper({
      items: this.flippableElements,
      focusedItemClass: PopoverItemNode.CSS.focused,
      allowedKeys: [
        keyCodes.TAB,
        keyCodes.UP,
        keyCodes.DOWN,
        keyCodes.ENTER,
      ],
    });

    this.flipper.onFlip(this.onFlip);
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

  /**
   * Called on flipper navigation
   */
  private onFlip = (): void => {
    this.items.forEach(item => item.onFlip());
  };

  /**
   * Toggles nothing found message visibility
   *
   * @param isDislayed - true if the message should be displayed
   */
  private toggleNothingFoundMessage(isDislayed: boolean): void {
    this.nodes.nothingFoundMessage.classList.toggle(Popover.CSS.nothingFoundMessageDisplayed, isDislayed);
  }

  /**
   * - Toggles item active state, if clicked popover item has property 'toggle' set to true.
   *
   * - Performs radiobutton-like behavior if the item has property 'toggle' set to string key.
   * (All the other items with the same key get unactive, and the item gets active)
   *
   * @param clickedItem - popover item that was clicked
   */
  private toggleIfNeeded(clickedItem: PopoverItemNode): void {
    if (clickedItem.toggle === true) {
      clickedItem.toggleActive();
    }

    if (typeof clickedItem.toggle === 'string') {
      const itemsInToggleGroup = this.items.filter(item => item.toggle === clickedItem.toggle);

      /** If there's only one item in toggle group, toggle it */
      if (itemsInToggleGroup.length === 1) {
        clickedItem.toggleActive();

        return;
      }

      /** Set clicked item as active and the rest items with same toggle key value as inactive */
      itemsInToggleGroup.forEach(item => {
        item.toggleActive(item === clickedItem);
      });
    }
  }
}
