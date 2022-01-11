/**
 * ReadOnly API
 */
export interface ReadOnly {
  /**
   * Set or toggle read-only state
   *
   * @param {Boolean|undefined} state - set or toggle state
   * @returns {Promise<boolean>} current value
   */
  toggle: (state?: boolean) => Promise<boolean>;

  /**
   * Contains current read-only state
   */
  isEnabled: boolean;
}
