import Module from '../../__module';
import Block from '../../block';
import { isEmpty } from '../../utils';
import { isSameBlockData } from '../../utils/blocks';
import { PopoverItemDefaultParams } from '../../utils/popover';

/**
 * Block Converter
 *
 * @todo Make the Conversion Toolbar no-module but a standalone class, like Toolbox
 */
export default class Conversion extends Module {
  /**
   * Returns list of all available conversion menu items for specified block
   *
   * @param block - block to get conversion items for
   */
  public async getItemsForBlock(block: Block): Promise<PopoverItemDefaultParams[]> {
    const conversionEntries = Array.from(this.Editor.Tools.blockTools.entries());

    const resultItems: PopoverItemDefaultParams[] = [];

    const blockData = await block.data;

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
          shouldSkip = toolName === block.name;
        }


        if (shouldSkip) {
          return;
        }

        resultItems.push({
          icon: toolboxItem.icon,
          title: toolboxItem.title,
          name: toolName,
          closeOnActivate: true,
          onActivate: async () => {
            const { BlockManager, BlockSelection, Caret } = this.Editor;

            const newBlock = await BlockManager.convert(block, toolName, toolboxItem.data);

            BlockSelection.clearSelection();

            Caret.setToBlock(newBlock, Caret.positions.END);
          },
        });
      });
    });

    return resultItems;
  }
}
