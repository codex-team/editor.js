import { IconReplace } from '@codexteam/icons';
import { InlineTool, API } from '../../../types';
import { MenuConfig } from '../../../types/tools';
import * as _ from '../utils';
import { Blocks, Selection, Conversion, I18n } from '../../../types/api';
import SelectionUtils from '../selection';

/**
 * Inline tools for converting blocks
 */
export default class ConvertInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   */
  public static isInline = true;

  /**
   * API for working with editor blocks
   */
  private readonly blocksAPI: Blocks;

  /**
   * API for working with Selection
   */
  private readonly selectionAPI: Selection;

  /**
   * API for conveting blocks to other tools
   */
  private readonly conversionAPI: Conversion;

  /**
   * I18n API
   */
  private readonly i18n: I18n;

  /**
   * @param api - Editor.js API
   */
  constructor({ api }: { api: API }) {
    this.i18n = api.i18n;
    this.blocksAPI = api.blocks;
    this.selectionAPI = api.selection;
    this.conversionAPI = api.conversion;
  }

  /**
   * Returns tool's UI config
   */
  public async render(): Promise<MenuConfig> {
    const currentSelection = SelectionUtils.get();
    const currentBlock = this.blocksAPI.getBlockByElement(currentSelection.anchorNode as HTMLElement);
    const convertToItems = await this.conversionAPI.getItemsForBlock(currentBlock);

    if (convertToItems.length === 0) {
      return [];
    }

    const currentBlockToolboxItem = await currentBlock.getActiveToolboxEntry();
    const icon = currentBlockToolboxItem !== undefined ? currentBlockToolboxItem.icon : IconReplace;
    const isDesktop =  !_.isMobileScreen();

    return {
      icon,
      name: 'convert-to',
      hint: {
        title: this.i18n.t('Convert to'),
      },
      children: {
        searchable: isDesktop,
        items: convertToItems,
        onOpen: () => {
          if (isDesktop) {
            this.selectionAPI.setFakeBackground();
            this.selectionAPI.save();
          }
        },
        onClose: () => {
          if (isDesktop) {
            this.selectionAPI.restore();
            this.selectionAPI.removeFakeBackground();
          }
        },
      },
    };
  }
}
