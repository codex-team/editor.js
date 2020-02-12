/**
 * ReadOnly API
 */
export interface ReadOnly {
  /**
   * Set or toggle read-only state
   *
   * @param {Boolean|undefined} state - set or toggle state
   * @returns {Boolean} current value
   */
  toggleReadOnly: (state?: boolean) => boolean;
}
