/**
 * @class Paste
 * @classdesc Contains methods to handle paste on editor
 *
 * @module Paste
 *
 * @version 2.0.0
 */

import {IBlockToolData} from '../interfaces/block-tool';
import IEditorConfig from '../interfaces/editor-config';

declare const Module: any;
declare const $: any;
declare const _: any;

/**
 * Tag substitute object.
 *
 * @param {string} tool - name of related Tool
 * @param {Function} handler - callback to handle pasted element
 */
interface ITagSubstitute {
  tool: string;
  handler: (element: HTMLElement) => IBlockToolData;
}

/**
 * Pattern substitute object.
 *
 * @param {string} key - pattern`s key
 * @param {RegExp} pattern - pasted pattern
 * @param {Function} handler - callback to handle pasted pattern
 * @param {string} tool - name of related Tool
 */
interface IPatternSubstitute {
  key: string;
  pattern: RegExp;
  handler: (text: string, key: string) => IBlockToolData;
  tool: string;
}

/**
 * Processed paste data object.
 *
 * @param {string} tool - name of related Tool
 * @param {HTMLElement} content - processed pasted content
 * @param {boolean} isBlock - true if content should be inserted as new Block
 * @param {Function} handler - callback that returns pasted data in IBlockToolData format
 */
interface IPasteData {
  tool: string;
  content: HTMLElement;
  isBlock: boolean;
  handler: (content: HTMLElement|string, patten?: RegExp) => IBlockToolData;
}

export default class Paste extends Module {

  /** If string`s length is greater than this number we don't check paste patterns */
  public static readonly PATTERN_PROCESSING_MAX_LENGTH = 450;

  /**
   * Tags` substitutions parameters
   */
  private toolsTags: {[tag: string]: ITagSubstitute} = {};

  /** Patterns` substitutions parameters */
  private toolsPatterns: IPatternSubstitute[] = [];

  /**
   * @constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  public async prepare(): Promise<void> {
    this.setCallback();
    this.processTools();
  }

  /**
   * Set onPaste callback handler
   */
  private setCallback(): void {
    const {Listeners, UI} = this.Editor;

    Listeners.on(UI.nodes.redactor, 'paste', this.processPastedData);
  }

  /**
   * Get and process tool`s paste configs
   */
  private processTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Object.entries(tools).forEach(this.processTool);
  }

  /**
   * Process paste config for each tools
   *
   * @param {string} tool
   */
  private processTool = ([name, tool]) => {
    const toolPasteConfig = tool.onPaste || {};

    if (this.config.initialBlock === name && !toolPasteConfig.handler) {
      _.log(
        `«${name}» Tool must provide a paste handler.`,
        'warn',
      );
    }

    if (typeof toolPasteConfig.handler !== 'function') {
      _.log(
        `Paste handler for «${name}» Tool should be a function.`,
        'warn',
      );
    } else {
      const tags = toolPasteConfig.tags || [];

      tags.forEach((tag) => {
        if (this.toolsTags.hasOwnProperty(tag)) {
          _.log(
            `Paste handler for «${name}» Tool on «${tag}» tag is skipped ` +
            `because it is already used by «${this.toolsTags[tag].tool}» Tool.`,
            'warn',
          );
          return;
        }

        this.toolsTags[tag] = {
          handler: toolPasteConfig.handler,
          tool: name,
        };
      });
    }

    if (!toolPasteConfig.patternHandler || _.isEmpty(toolPasteConfig.patterns)) {
      return;
    }

    if (typeof toolPasteConfig.patternHandler !== 'function') {
      _.log(
        `Pattern parser for "${name}" Tool should be a function.`,
        'warn',
      );
    } else {
      Object.entries(toolPasteConfig.patterns).forEach(([key, pattern]: [string, RegExp]) => {
        /** Still need to validate pattern as it provided by user */
        if (!(pattern instanceof RegExp)) {
          _.log(
            `Pattern ${pattern} for "${tool}" Tool is skipped because it should be a Regexp instance.`,
            'warn',
          );
        }

        this.toolsPatterns.push({
          key,
          pattern,
          handler: toolPasteConfig.patternHandler,
          tool: name,
        });
      });
    }
  }

  /**
   * Check if browser behavior suits better
   *
   * @param {EventTarget} element - element where content has been pasted
   * @returns {boolean}
   */
  private isNativeBehaviour(element: EventTarget): boolean {
    const {Editor: {BlockManager}} = this;

    if ( $.isNativeInput(element) ) {
      return true;
    }

    const block = BlockManager.getBlock(element);

    return !block;
  }

  /**
   * Get pasted data, process it and insert into editor
   *
   * @param {ClipboardEvent} event
   */
  private processPastedData = async (event: ClipboardEvent): Promise<void> => {
    const {
      Editor: {Tools, Sanitizer, BlockManager, Caret},
      config: {toolsConfig},
    } = this;

    /** If target is native input or is not Block, use browser behaviour */
    if (this.isNativeBehaviour(event.target)) {
      return;
    }

    event.preventDefault();

    const block = BlockManager.getBlock(event.target);
    const toolConfig = toolsConfig[block.name];

    /** If paste is dissalowed in block do nothing */
    if (toolConfig && toolConfig[Tools.apiSettings.IS_PASTE_DISALLOWED]) {
      return;
    }

    const htmlData  = event.clipboardData.getData('text/html'),
          plainData = event.clipboardData.getData('text/plain');

    /** Add all block tags and tags can be substituted to sanitizer configuration */
    const blockTags = $.blockElements.reduce((result, tag) => {
      result[tag.toLowerCase()] = {};

      return result;
    }, {});
    const toolsTags = Object.keys(this.toolsTags).reduce((result, tag) => {
      result[tag.toLowerCase()] = {};

      return result;
    }, {});

    const customConfig = {tags: Object.assign({}, blockTags, toolsTags, Sanitizer.defaultConfig.tags)};
    const cleanData = Sanitizer.clean(htmlData, customConfig);

    let dataToInsert = [];

    /** If there is no HTML or HTML string is equal to plain one, process it as plain text */
    if (!cleanData.trim() || cleanData.trim() === plainData || !$.isHTMLString(cleanData)) {
      dataToInsert = this.processPlain(plainData);
    } else {
      dataToInsert = this.processHTML(htmlData);
    }

    if (dataToInsert.length === 1 && !dataToInsert[0].isBlock) {
      this.processSingleBlock(dataToInsert.pop());
      return;
    }

    this.splitBlock();

    await Promise.all(dataToInsert.map(
      async (data, i) => await this.insertBlock(data, i === 0),
    ));

    Caret.setToBlock(BlockManager.currentBlock, 0, true);
  }

  /**
   * Process paste to single Block:
   * 1. Find patterns` matches
   * 2. Insert new block if it is not the same type as current one
   * 3. Just insert text if there is no substitutions
   *
   * @param {IPasteData} dataToInsert
   */
  private async processSingleBlock(dataToInsert: IPasteData): Promise<void> {
    const initialTool = this.config.initialBlock;
    const {BlockManager} = this.Editor;
    const {content, tool} = dataToInsert;

    if (tool === initialTool && content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        this.splitBlock();

        if (BlockManager.currentBlock.isEmpty) {
          BlockManager.replace(blockData.tool, blockData.data);
        } else {
          BlockManager.insert(blockData.tool, blockData.data);
        }
        return;
      }
    }

    /** If there is no pattern substitute - insert string as it is */
    document.execCommand('insertHTML', false, content.innerHTML);
  }

  /**
   * Get patterns` matches
   *
   * @param {string} text
   * @returns Promise<{data: IBlockToolData, tool: string}>
   */
  private async processPattern(text: string): Promise<{data: IBlockToolData, tool: string}> {
    const pattern =  this.toolsPatterns.find((substitute) => {
      const execResult = substitute.pattern.exec(text);

      if (!execResult) {
        return false;
      }

      return text === execResult.shift();
    });

    const data = pattern && await pattern.handler(text, pattern.key);

    return data && {
      data,
      tool: pattern.tool,
    };
  }

  /**
   *
   * @param {IPasteData} data
   * @param {Boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {Promise<void>}
   */
  private async insertBlock(data: IPasteData, canReplaceCurrentBlock: boolean = false): Promise<void> {
    const blockData = await data.handler(data.content);
    const {BlockManager, Caret} = this.Editor;
    const {currentBlock} = BlockManager;

    if (canReplaceCurrentBlock && currentBlock.isEmpty) {
      BlockManager.replace(data.tool, blockData);
      return;
    }

    const Block = BlockManager.insert(data.tool, blockData);

    Caret.setToBlock(Block);
  }

  /**
   * Split current block if paste isn't in the end of the block
   */
  private splitBlock() {
    const {BlockManager, Caret} = this.Editor;

    /** If we paste into middle of the current block:
     *  1. Split
     *  2. Navigate to the first part
     */
    if (!BlockManager.currentBlock.isEmpty && !Caret.isAtEnd) {
      BlockManager.split();
      BlockManager.currentBlockIndex--;
    }
  }

  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML
   * @returns {IPasteData[]}
   */
  private processHTML(innerHTML: string): IPasteData[] {
    const {Tools, Sanitizer} = this.Editor;
    const initialTool = this.config.initialBlock;
    const wrapper = $.make('DIV');

    wrapper.innerHTML = innerHTML;

    const nodes = this.getNodes(wrapper);

    return nodes
      .map((node) => {
        let content, tool = initialTool, isBlock = false;

        switch (node.nodeType) {
          /** If node is a document fragment, use temp wrapper to get innerHTML */
          case Node.DOCUMENT_FRAGMENT_NODE:
            content = $.make('div');
            content.appendChild(node);
            content.innerHTML = Sanitizer.clean(content.innerHTML);
            break;

          /** If node is an element, then there might be a substitution */
          case Node.ELEMENT_NODE:
            content = node as HTMLElement;
            isBlock = true;
            content.innerHTML = Sanitizer.clean(content.innerHTML);

            if (this.toolsTags[content.tagName]) {
              tool = this.toolsTags[content.tagName].tool;
            }
            break;
        }

        const handler = Tools.blockTools[tool].onPaste.handler;

        return {content, isBlock, handler, tool};
    })
    .filter((data) => !$.isNodeEmpty(data.content));
  }

  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain
   * @returns {IPasteData[]}
   */
  private processPlain(plain: string): IPasteData[] {
    const {initialBlock} = this.config as {initialBlock: string};
    const {Tools} = this.Editor;

    if (!plain) {
      return [];
    }

    const tool = initialBlock;
    const handler = Tools.blockTools[tool].onPaste.handler;

    return plain.split('\n\n').map((text) => {
      const content = $.make('div');

      content.innerHTML = text;

      return {content, tool, isBlock: false, handler};
    });
  }

  /**
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper
   * @returns {Node[]}
   */
  private getNodes(wrapper: Node): Node[] {
    const children = Array.from(wrapper.childNodes);
    const tags = Object.keys(this.toolsTags);

    const reducer = (nodes: Node[], node: Node): Node[] => {
      if ($.isEmpty(node)) {
        return nodes;
      }

      const lastNode = nodes[nodes.length - 1];

      let destNode: Node = new DocumentFragment();

      if (lastNode && $.isFragment(lastNode)) {
        destNode = nodes.pop();
      }

      switch (node.nodeType) {
        /**
         * If node is HTML element:
         * 1. Check if it is inline element
         * 2. Check if it contains another block or substitutable elements
         */
        case Node.ELEMENT_NODE:
          const element = node as HTMLElement;

          /** Append inline elements to previous fragment */
          if (
            !$.blockElements.includes(element.tagName.toLowerCase()) &&
            !tags.includes(element.tagName.toLowerCase())
          ) {
            destNode.appendChild(element);
            return [...nodes, destNode];
          }

          if (
            (
              tags.includes(element.tagName.toLowerCase()) &&
              Array.from(element.children).every(({tagName}) => !tags.includes(tagName.toLowerCase()))
            ) || (
              $.blockElements.includes(element.tagName.toLowerCase()) &&
              Array.from(element.children).every(
                ({tagName}) => !$.blockElements.includes(tagName.toLowerCase()),
              )
            )
          ) {
            return [...nodes, element];
          }
          break;

        /**
         * If node is text node, wrap it with DocumentFragment
         */
        case Node.TEXT_NODE:
          destNode.appendChild(node);
          return [...nodes, destNode];

        default:
          return [...nodes, destNode];
      }

      return [...nodes, ...Array.from(node.childNodes).reduce(reducer, [])];
    };

    return children.reduce(reducer, []);
  }
}
