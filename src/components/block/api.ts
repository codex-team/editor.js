import Block from './index';
import { BlockToolData, ToolConfig, ToolboxConfigEntry } from '../../../types/tools';
import { SavedData } from '../../../types/data-formats';
import { BlockAPI as BlockAPIInterface } from '../../../types/api';

/**
 * Constructs new BlockAPI object
 *
 * @class
 * @param {Block} block - Block to expose
 */
function BlockAPI(
  block: Block
): void {
  const blockAPI: BlockAPIInterface = {
    /**
     * Block id
     *
     * @returns {string}
     */
    get id(): string {
      return block.id;
    },
    /**
     * Tool name
     *
     * @returns {string}
     */
    get name(): string {
      return block.name;
    },

    /**
     * Tool config passed on Editor's initialization
     *
     * @returns {ToolConfig}
     */
    get config(): ToolConfig {
      return block.config;
    },

    /**
     * .ce-block element, that wraps plugin contents
     *
     * @returns {HTMLElement}
     */
    get holder(): HTMLElement {
      return block.holder;
    },

    /**
     * True if Block content is empty
     *
     * @returns {boolean}
     */
    get isEmpty(): boolean {
      return block.isEmpty;
    },

    /**
     * True if Block is selected with Cross-Block selection
     *
     * @returns {boolean}
     */
    get selected(): boolean {
      return block.selected;
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
     * @returns {boolean}
     */
    get stretched(): boolean {
      return block.stretched;
    },

    /**
     * True if Block has inputs to be focused
     */
    get focusable(): boolean {
      return block.focusable;
    },

    /**
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     * @returns {unknown}
     */
    call(methodName: string, param?: object): unknown {
      return block.call(methodName, param);
    },

    /**
     * Save Block content
     *
     * @returns {Promise<void|SavedData>}
     */
    save(): Promise<void|SavedData> {
      return block.save();
    },

    /**
     * Validate Block data
     *
     * @param {BlockToolData} data - data to validate
     * @returns {Promise<boolean>}
     */
    validate(data: BlockToolData): Promise<boolean> {
      return block.validate(data);
    },

    /**
     * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
     * Can be useful for block changes invisible for editor core.
     */
    dispatchChange(): void {
      block.dispatchChange();
    },

    /**
     * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
     * This method returns the entry that is related to the Block (depended on the Block data)
     */
    getActiveToolboxEntry(): Promise<ToolboxConfigEntry | undefined> {
      return block.getActiveToolboxEntry();
    },
  };

  Object.setPrototypeOf(this, blockAPI);
}

export default BlockAPI;
