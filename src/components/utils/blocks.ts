import { BlockAPI } from '../../../types';
import type { ConversionConfig } from '../../../types/configs/conversion-config';
import { SavedData } from '../../../types/data-formats';
import type { BlockToolData } from '../../../types/tools/block-tool-data';
import type Block from '../block';
import BlockTool from '../tools/block';
import { isFunction, isString, log, equals, isEmpty } from '../utils';
import { isToolConvertable } from './tools';


/**
 * Check if block has valid conversion config for export or import.
 *
 * @param block - block to check
 * @param direction - export for block to merge from, import for block to merge to
 */
export function isBlockConvertable(block: Block, direction: 'export' | 'import'): boolean {
  return isToolConvertable(block.tool, direction);
}

/**
 * Checks that all the properties of the first block data exist in second block data with the same values.
 *
 * Example:
 *
 * data1 = { level: 1 }
 *
 * data2 = {
 *    text: "Heading text",
 *    level: 1
 *  }
 *
 * isSameBlockData(data1, data2) => true
 *
 * @param data1 – first block data
 * @param data2 – second block data
 */
export function isSameBlockData(data1: BlockToolData, data2: BlockToolData): boolean {
  return Object.entries(data1).some((([propName, propValue]) => {
    return data2[propName] && equals(data2[propName], propValue);
  }));
}

/**
 * Returns list of tools you can convert specified block to
 *
 * @param block - block to get conversion items for
 * @param allBlockTools - all block tools available in the editor
 */
export async function getConvertibleToolsForBlock(block: BlockAPI, allBlockTools: BlockTool[]): Promise<BlockTool[]> {
  const savedData = await block.save() as SavedData;
  const blockData = savedData.data;

  return allBlockTools.reduce((result, tool) => {
    /**
     * Skip tools without «import» rule specified
     */
    if (!isToolConvertable(tool, 'import')) {
      return result;
    }

    /** Filter out invalid toolbox entries */
    const actualToolboxItems = tool.toolbox.filter((toolboxItem) => {
      /**
       * Skip items that don't pass 'toolbox' property or do not have an icon
       */
      if (isEmpty(toolboxItem) || !toolboxItem.icon) {
        return false;
      }

      if (toolboxItem.data !== undefined) {
        /**
         * When a tool has several toolbox entries, we need to make sure we do not add
         * toolbox item with the same data to the resulting array. This helps exclude duplicates
         */
        if (isSameBlockData(toolboxItem.data, blockData)) {
          return false;
        }
      } else if (tool.name === block.name) {
        return false;
      }

      return true;
    });

    result.push({
      ...tool,
      toolbox: actualToolboxItems,
    });

    return result;
  }, []);
}


/**
 * Check if two blocks could be merged.
 *
 * We can merge two blocks if:
 *  - they have the same type
 *  - they have a merge function (.mergeable = true)
 *  - If they have valid conversions config
 *
 * @param targetBlock - block to merge to
 * @param blockToMerge - block to merge from
 */
export function areBlocksMergeable(targetBlock: Block, blockToMerge: Block): boolean {
  /**
   * If target block has not 'merge' method, we can't merge blocks.
   *
   * Technically we can (through the conversion) but it will lead a target block delete and recreation, which is unexpected behavior.
   */
  if (!targetBlock.mergeable) {
    return false;
  }

  /**
   * Tool knows how to merge own data format
   */
  if (targetBlock.name === blockToMerge.name) {
    return true;
  }

  /**
   * We can merge blocks if they have valid conversion config
   */
  return isBlockConvertable(blockToMerge, 'export') && isBlockConvertable(targetBlock, 'import');
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

