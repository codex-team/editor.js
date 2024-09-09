/**
 * Hint parameters
 */
export interface HintParams {
  /**
   * Title of the hint
   */
  title: string;

  /**
   * Secondary text to be displayed below the title
   */
  description?: string;

  /**
   * Horizontal alignment of the hint content. Default is 'start'
   */
  alignment?: HintTextAlignment;
}

/**
 * Possible hint positions
 */
export type HintPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Horizontal alignment of the hint content
 */
export type HintTextAlignment = 'start' | 'center';
