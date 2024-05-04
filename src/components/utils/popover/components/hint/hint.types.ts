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
}

/**
 * Possible hint positions
 */
export type HintPosition = 'top' | 'bottom' | 'left' | 'right';
