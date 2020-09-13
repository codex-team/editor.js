import Block from './index';
import { BlockToolData, ToolConfig } from '../../../types/tools';
import { SavedData } from '../../../types/data-formats';
import { BlockAPI as BlockAPIInterface } from '../../../types/api';
import * as _ from '../utils';

/**
 * Constructs new BlockAPI object
 *
 * @class
 *
 * @param {Block} block - Block to expose
 * @param {Function} isReadOnlyEnabled - method to check if read-only mode is enabled
 */
function BlockAPI(
  block: Block,
  isReadOnlyEnabled = (): boolean => false
): void {
  const blockAPI: BlockAPIInterface = {
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
      if (isReadOnlyEnabled()) {
        _.logLabeled(`Read-only mode is enabled, you can't set block's «stretched» property`, 'warn');

        return;
      }

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
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     *
     * @returns {unknown}
     */
    call(methodName: string, param?: object): unknown {
      if (isReadOnlyEnabled()) {
        _.logLabeled(`Read-only mode is enabled, you can't call block's «${methodName}» method`, 'warn');

        return;
      }

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
     *
     * @returns {Promise<boolean>}
     */
    validate(data: BlockToolData): Promise<boolean> {
      return block.validate(data);
    },
  };

  Object.setPrototypeOf(this, blockAPI);
}

export default BlockAPI;
