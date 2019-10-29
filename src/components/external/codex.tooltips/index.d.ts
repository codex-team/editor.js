/**
 * Base options interface for tooltips
 */
export interface TooltipOptions {
  position: string;
}

/**
 * Tooltip supported content
 */
export type TooltipContent = HTMLElement | DocumentFragment | Node;

declare namespace tooltip {
  /**
   * @param {HTMLElement} element
   * @param {TooltipContent} content
   * @param {TooltipOptions} options
   */
  export function show(
    element: HTMLElement,
    content: TooltipContent,
    options?: TooltipOptions,
  ): void;

  /**
   * Hides tooltip
   */
  export function hide(): void;
}

export default tooltip;
