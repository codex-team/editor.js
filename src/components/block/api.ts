import Block from './index';
import {BlockToolData, ToolConfig} from '../../../types/tools';
import {SavedData} from '../../types-internal/block-data';
import {BlockAPI as BlockAPIInterface} from '../../../types/api';

function BlockAPI(block: Block) {
  const blockAPI: BlockAPIInterface =  {
    /**
     * Tool name
     *
     * @return {string}
     */
    get name(): string {
      return block.name;
    },

    /**
     * Tool config passed on Editor's initialization
     *
     * @return {ToolConfig}
     */
    get settings(): ToolConfig {
      return block.settings;
    },

    /**
     * .ce-block element, that wraps plugin contents
     *
     * @return {HTMLElement}
     */
    get holder(): HTMLElement {
      return block.holder;
    },

    /**
     * Tool contents holder, returned from Tool's render() method
     *
     * @return {HTMLElement}
     */
    get pluginsContent(): HTMLElement {
      return block.pluginsContent;
    },

    /**
     * Saved Block data
     *
     * @return {BlockToolData}
     */
    get data(): Promise<BlockToolData> {
      return block.data;
    },

    /**
     * True if Tool has merge method
     *
     * @return {boolean}
     */
    get mergeable(): boolean {
      return block.mergeable;
    },

    /**
     * True if Block content is empty
     *
     * @return {boolean}
     */
    get isEmpty(): boolean {
      return block.isEmpty;
    },

    /**
     * True if Block has media
     *
     * @return {boolean}
     */
    get hasMedia(): boolean {
      return block.hasMedia;
    },

    /**
     * True if Block is selected with Cross-Block selection
     *
     * @return {boolean}
     */
    get selected(): boolean {
      return block.selected;
    },

    /**
     * True if caret at Block
     *
     * @return {boolean}
     */
    get focused(): boolean {
      return block.focused;
    },

    /**
     * Set Block's stretch state
     *
     * @param {boolean} state — state to set
     */
    set stretched(state: boolean) {
      block.stretched = state;
    },

    /**
     * True if Block is stretched
     *
     * @return {boolean}
     */
    get stretched(): boolean {
      return block.stretched;
    },

    /**
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     *
     * @return {void}
     */
    call(methodName: string, param?: object): void {
      block.call(methodName, param);
    },

    /**
     * Save Block content
     *
     * @return {Promise<void|SavedData>}
     */
    save(): Promise<void|SavedData> {
      return block.save();
    },

    /**
     * Validate Block data
     *
     * @param {BlockToolData} data
     *
     * @return {Promise<boolean>}
     */
    validate(data: BlockToolData): Promise<boolean> {
      return block.validate(data);
    },
  };

  Object.setPrototypeOf(this, blockAPI);
}

export default BlockAPI;
