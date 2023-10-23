/* eslint-disable jsdoc/no-undefined-types */
/**
 * Use external module CodeX Tooltip
 */
import CodeXTooltips from 'codex-tooltip';
import type { TooltipOptions, TooltipContent } from 'codex-tooltip/types';
import { EditorConfig } from '../../../types';

/**
 * Tooltips lib: CodeX Tooltips
 *
 * @see https://github.com/codex-team/codex.tooltips
 */
let lib: null | CodeXTooltips = null;

/**
 * If library is needed, but it is not initialized yet, this function will initialize it
 *
 * For example, if editor was destroyed and then initialized again
 *
 * @param {string} nonce - The nonce to apply to the injected styles.
 */
export function prepare(nonce?: string): void {
  if (lib) {
    return;
  }

  lib = new CodeXTooltips(nonce);
}

/**
 * Shows tooltip on element with passed HTML content
 *
 * @param {HTMLElement} element - any HTML element in DOM
 * @param content - tooltip's content
 * @param options - showing settings
 * @param {EditorConfig} config - The EditorJS config
 */
export function show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions, config?: EditorConfig): void {
  prepare(config?.style.nonce);

  lib?.show(element, content, options);
}

/**
 * Hides tooltip
 *
 * @param skipHidingDelay — pass true to immediately hide the tooltip
 * @param {EditorConfig} config - The EditorJS config
 */
export function hide(skipHidingDelay = false, config?: EditorConfig): void {
  prepare(config?.style.nonce);

  lib?.hide(skipHidingDelay);
}

/**
 * Binds 'mouseenter' and 'mouseleave' events that shows/hides the Tooltip
 *
 * @param {HTMLElement} element - any HTML element in DOM
 * @param content - tooltip's content
 * @param options - showing settings
 * @param {EditorConfig} config - The EditorJS config
 */
export function onHover(element: HTMLElement, content: TooltipContent, options?: TooltipOptions, config?: EditorConfig): void {
  prepare(config?.style.nonce);

  lib?.onHover(element, content, options);
}

/**
 * Release the library
 */
export function destroy(): void {
  lib?.destroy();
  lib = null;
}
