import { PopoverItemParams } from '../../../../types';

/**
 * Params required to render popover
 */
export interface PopoverParams {
  /**
   * Popover items config
   */
  items: PopoverItemParams[];

  /**
   * Element of the page that creates 'scope' of the popover.
   * Depending on its size popover position will be calculated
   */
  scopeElement?: HTMLElement;

  /**
   * Arbitrary html element to be inserted before items list
   */
  customContent?: HTMLElement;

  /**
   * List of html elements inside custom content area that should be available for keyboard navigation
   */
  customContentFlippableItems?: HTMLElement[];

  /**
   * True if popover should contain search field
   */
  searchable?: boolean;

  /**
   * Popover texts overrides
   */
  messages?: PopoverMessages

  /**
   * CSS class name for popover root element
   */
  class?: string;

  /**
   * Popover nesting level. 0 value means that it is a root popover
   */
  nestingLevel?: number;
}

/**
 * Texts used inside popover
 */
export interface PopoverMessages {
  /** Text displayed when search has no results */
  nothingFound?: string;

  /** Search input label */
  search?: string
}

/**
 * Event that can be triggered by the Popover
 */
export enum PopoverEvent {
  /**
   * When popover closes
   */
  Close = 'close'
}

/**
 * Events fired by the Popover
 */
export interface PopoverEventMap {
  /**
   * Fired when popover closes
   */
  [PopoverEvent.Close]: undefined;
}

/**
 * HTML elements required to display popover
 */
export interface PopoverNodes {
  /** Root popover element */
  popover: HTMLElement;

  /** Wraps all the visible popover elements, has background and rounded corners */
  popoverContainer: HTMLElement;

  /** Message displayed when no items found while searching */
  nothingFoundMessage: HTMLElement;

  /** Popover items wrapper */
  items: HTMLElement;

  /** Custom html content area */
  customContent: HTMLElement | undefined;
}

/**
 * HTML elements required to display mobile popover
 */
export interface PopoverMobileNodes extends PopoverNodes {
  /** Popover header element */
  header: HTMLElement;

  /** Overlay, displayed under popover on mobile */
  overlay: HTMLElement;
}
