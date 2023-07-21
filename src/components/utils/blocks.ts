import type { ConversionConfig } from '../../../types/configs/conversion-config';
import type { BlockToolData } from '../../../types/tools/block-tool-data';
import type Block from '../block';
import { isFunction, isString, log } from '../utils';

/**
 * Check if two blocks could be merged.
 *
 * We can merge two blocks if:
 *  - they have the same type
 *  - they have a merge function (.mergeable = true)
 *
 * @param targetBlock - block to merge to
 * @param blockToMerge - block to merge from
 */
export function areBlocksMergeable(targetBlock: Block, blockToMerge: Block): boolean {
  return targetBlock.mergeable && targetBlock.name === blockToMerge.name;
}

/**
 * Using conversionConfig, convert block data to string.
 *
 * @param blockData - block data to convert
 * @param conversionConfig - tool's conversion config
 */
export function convertBlockDataToString(blockData: BlockToolData, conversionConfig?: ConversionConfig ): string {
  const exportProp = conversionConfig?.export;

  if (isFunction(exportProp)) {
    return exportProp(blockData);
  } else if (isString(exportProp)) {
    return blockData[exportProp];
  } else {
    /**
     * Tool developer provides 'export' property, but it is not correct. Warn him.
     */
    if (exportProp !== undefined) {
      log('Conversion «export» property must be a string or function. ' +
      'String means key of saved data object to export. Function should export processed string to export.');
    }

    return '';
  }
}

/**
 * Using conversionConfig, convert string to block data.
 *
 * @param stringToImport - string to convert
 * @param conversionConfig - tool's conversion config
 */
export function convertStringToBlockData(stringToImport: string, conversionConfig?: ConversionConfig): BlockToolData {
  const importProp = conversionConfig?.import;

  if (isFunction(importProp)) {
    return importProp(stringToImport);
  } else if (isString(importProp)) {
    return {
      [importProp]: stringToImport,
    };
  } else {
    /**
     * Tool developer provides 'import' property, but it is not correct. Warn him.
     */
    if (importProp !== undefined) {
      log('Conversion «import» property must be a string or function. ' +
      'String means key of tool data to import. Function accepts a imported string and return composed tool data.');
    }

    return {};
  }
}
