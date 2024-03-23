const ELEMENT_DELIMITER = '__';
const MODIFIER_DELIMITER = '--';

/**
 * Utility function that allows to construct class names from block and element names
 *
 * @param blockName - string with block name
 * @param elementName - string with element name
 * @param modifier - modifier to be appended
 */
export function bem(blockName: string) {
  return (elementName?: string, modifier?: string) => {
    const className = [blockName, elementName]
      .filter(x => !!x)
      .join(ELEMENT_DELIMITER);

    return [className, modifier]
      .filter(x => !!x)
      .join(MODIFIER_DELIMITER);
  };
}
