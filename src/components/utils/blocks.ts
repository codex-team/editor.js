import type { ConversionConfig } from '../../../types/configs/conversion-config';
import type { BlockToolData } from '../../../types/tools/block-tool-data';
import { EditorModules } from '../../types-internal/editor-modules';
import type Block from '../block';
import { isFunction, isString, log, equals, isEmpty } from '../utils';
import { PopoverItemDefaultParams } from './popover';


/**
 * Check if block has valid conversion config for export or import.
 *
 * @param block - block to check
 * @param direction - export for block to merge from, import for block to merge to
 */
export function isBlockConvertable(block: Block, direction: 'export' | 'import'): boolean {
  if (!block.tool.conversionConfig) {
    return false;
  }

  const conversionProp = block.tool.conversionConfig[direction];

  return isFunction(conversionProp) || isString(conversionProp);
}

/**
 * Checks that all the properties of the first block data exist in second block data with the same values.
 *
 * If we have several entries with their own data overrides,
 * find those who matches some current data property
 *
 * Example:
 *  Tools' toolbox: [
 *    {title: "Heading 1", data: {level: 1} },
 *    {title: "Heading 2", data: {level: 2} }
 *  ]
 *
 *  the Block data: {
 *    text: "Heading text",
 *    level: 2
 *  }
 *
 *  that means that for the current block, the second toolbox item (matched by "{level: 2}") is active
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

/**
 * Returns list of all available conversion menu items
 *
 * @param currentBlock - current block we need to get convetion data for
 * @param editorModules - access to editor modules
 */
export async function getConvertToItems(currentBlock: Block, editorModules: EditorModules): Promise<PopoverItemDefaultParams[]> {
  const conversionEntries = Array.from(editorModules.Tools.blockTools.entries());

  const resultItems: PopoverItemDefaultParams[] = [];

  const blockData = await currentBlock.data;

  conversionEntries.forEach(([toolName, tool]) => {
    const conversionConfig = tool.conversionConfig;

    /**
     * Skip tools without «import» rule specified
     */
    if (!conversionConfig || !conversionConfig.import) {
      return;
    }

    tool.toolbox?.forEach((toolboxItem) => {
      /**
       * Skip tools that don't pass 'toolbox' property
       */
      if (isEmpty(toolboxItem) || !toolboxItem.icon) {
        return;
      }

      let shouldSkip = false;

      if (toolboxItem.data !== undefined) {
        /**
         * When a tool has several toolbox entries, we need to make sure we do not add
         * toolbox item with the same data to the resulting array. This helps exclude duplicates
         */
        const hasSameData = isSameBlockData(toolboxItem.data, blockData);

        shouldSkip = hasSameData;
      } else {
        shouldSkip = toolName === currentBlock.name;
      }


      if (shouldSkip) {
        return;
      }

      resultItems.push({
        icon: toolboxItem.icon,
        title: toolboxItem.title,
        name: toolName,
        closeOnActivate: true,
        onActivate: () => {
          const { BlockManager, BlockSelection, Caret } = editorModules;

          BlockManager.convert(currentBlock, toolName, toolboxItem.data);

          BlockSelection.clearSelection();

          window.requestAnimationFrame(() => {
            Caret.setToBlock(currentBlock, Caret.positions.END);
          });
        },
      });
    });
  });

  return resultItems;
}

/**
 * Returns active item within toolbox config of the specified block
 *
 * @param block - block to get active toolbox item for
 */
export async function getBlockActiveToolboxEntry(block: Block): Promise<PopoverItemDefaultParams> {
  const toolboxItems = block.tool.toolbox;

  /**
   * If Tool specifies just the single entry, treat it like an active
   */
  if (toolboxItems?.length === 1) {
    return Promise.resolve(toolboxItems[0]);
  }

  const blockData = await block.data;

  return toolboxItems?.find((item) => {
    return isSameBlockData(item.data, blockData);
  });
}
