const ELEMENT_DELIMITER = '__';
const MODIFIER_DELIMITER = '--';

/**
 * Utility function that allows to construct class names from block and element names
 *
 * @example bem('ce-popover)() -> 'ce-popover'
 * @example bem('ce-popover)('container') -> 'ce-popover__container'
 * @example bem('ce-popover)('container', 'hidden') -> 'ce-popover__container--hidden'
 * @example bem('ce-popover)(null, 'hidden') -> 'ce-popover--hidden'
 * @param blockName - string with block name
 */
export function bem(blockName: string) {
  /**
   * @param elementName - string with element name
   * @param modifier - modifier to be appended
   */
  return (elementName?: string | null, modifier?: string) => {
    const className = [blockName, elementName]
      .filter(x => !!x)
      .join(ELEMENT_DELIMITER);

    return [className, modifier]
      .filter(x => !!x)
      .join(MODIFIER_DELIMITER);
  };
}
