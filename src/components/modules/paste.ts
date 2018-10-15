import IBlockToolData from '../interfaces/tools/block-tool';
import IEditorConfig from '../interfaces/editor-config';
import CaretClass from './caret';
import SelectionUtils from '../selection';

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
 * Files` types substitutions object.
 *
 * @param {string[]} extensions - array of extenstions Tool can handle
 * @param {string[]} mimeTypes - array of MIME types Tool can handle
 * @param {Function} handler - callback to handle pasted File
 */
interface IFilesSubstitution {
  extensions: string[];
  mimeTypes: string[];
  handler: (file: File) => IBlockToolData;
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

/**
 * Tool onPaste configuration object
 */
interface IPasteConfig {
  tags?: string[];
  handler?: (element: HTMLElement) => IBlockToolData;
  patterns?: {[key: string]: RegExp};
  patternHandler?: (text: string, key: string) => IBlockToolData;
  files?: {extensions?: string[], mimeTypes?: string[]};
  fileHandler?: (file: File) => IBlockToolData;
}

/**
 * @class Paste
 * @classdesc Contains methods to handle paste on editor
 *
 * @module Paste
 *
 * @version 2.0.0
 */
export default class Paste extends Module {

  /** If string`s length is greater than this number we don't check paste patterns */
  public static readonly PATTERN_PROCESSING_MAX_LENGTH = 450;

  /**
   * Tags` substitutions parameters
   */
  private toolsTags: {[tag: string]: ITagSubstitute} = {};

  /**
   * Store tags to substitute by tool name
   */
  private tagsByTool: {[tools: string]: string[]} = {};

  /** Patterns` substitutions parameters */
  private toolsPatterns: IPatternSubstitute[] = [];

  /** Files` substitutions parameters */
  private toolsFiles: {
    [tool: string]: IFilesSubstitution,
  } = {};

  /**
   * @constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Set onPaste callback and collect tools` paste configurations
   *
   * @public
   */
  public async prepare(): Promise<void> {
    this.setCallback();
    this.processTools();
  }

  /**
   * Handle pasted or dropped data transfer object
   *
   * @param {DataTransfer} dataTransfer - pasted or dropped data transfer object
   */
  public async processDataTransfer(dataTransfer: DataTransfer, isDragNDrop = false): Promise<void> {
    const { Sanitizer } = this.Editor;

    if (dataTransfer.types.includes('Files')) {
      await this.processFiles(dataTransfer.items);
      return;
    }

    const plainData = dataTransfer.getData('text/plain');
    let htmlData  = dataTransfer.getData('text/html');

    /**
     *  If text was drag'n'dropped, wrap content with P tag to insert it as the new Block
     */
    if (isDragNDrop && plainData.trim() && htmlData.trim()) {
      htmlData = '<p>' + ( htmlData.trim() ? htmlData : plainData ) + '</p>';
    }

    /** Add all tags that can be substituted to sanitizer configuration */
    const toolsTags = Object.keys(this.toolsTags).reduce((result, tag) => {
      result[tag.toLowerCase()] = true;

      return result;
    }, {});

    const customConfig = Object.assign({}, toolsTags, Sanitizer.defaultConfig.tags);
    const cleanData = Sanitizer.clean(htmlData, customConfig);

    /** If there is no HTML or HTML string is equal to plain one, process it as plain text */
    if (!cleanData.trim() || cleanData.trim() === plainData || !$.isHTMLString(cleanData)) {
      await this.processText(plainData);
    } else {
      await this.processText(cleanData, true);
    }
  }

  /**
   * Set onPaste callback handler
   */
  private setCallback(): void {
    const {Listeners, UI} = this.Editor;

    Listeners.on(UI.nodes.redactor, 'paste', this.handlePasteEvent);
  }

  /**
   * Get and process tool`s paste configs
   */
  private processTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Object.entries(tools).forEach(this.processTool);
  }

  /**
   * Process paste config for each tool
   *
   * @param {string} name
   * @param {Tool} tool
   */
  private processTool = ([name, tool]) => {
    try {
      const toolPasteConfig = tool.onPaste || {};

      this.getTagsConfig(name, toolPasteConfig);
      this.getFilesConfig(name, toolPasteConfig);
      this.getPatternsConfig(name, toolPasteConfig);
    } catch (e) {
      _.log(
        `Paste handling for «${name}» Tool hasn't been set up because of the error`,
        'warn',
        e,
      );
    }
  }

  /**
   * Get tags to substitute by Tool
   *
   * @param {string} name - Tool name
   * @param {IPasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getTagsConfig(name: string, toolPasteConfig: IPasteConfig): void {
    if (this.config.initialBlock === name && !toolPasteConfig.handler) {
      _.log(
        `«${name}» Tool must provide a paste handler.`,
        'warn',
      );
    }

    if (!toolPasteConfig.handler) {
      return;
    }

    if (typeof toolPasteConfig.handler !== 'function') {
      _.log(
        `Paste handler for «${name}» Tool should be a function.`,
        'warn',
      );

      return;
    }

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

      this.toolsTags[tag.toUpperCase()] = {
        handler: toolPasteConfig.handler,
        tool: name,
      };
    });

    this.tagsByTool[name] = tags.map((t) => t.toUpperCase());
  }

  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param {string} name - Tool name
   * @param {IPasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getFilesConfig(name: string, toolPasteConfig: IPasteConfig): void {

    const {fileHandler, files = {}} = toolPasteConfig;
    let {extensions, mimeTypes} = files;

    if (!fileHandler || (!extensions && !mimeTypes)) {
      return;
    }

    if (typeof fileHandler !== 'function') {
      _.log(`Drop handler for «${name}» Tool should be a function.`);
      return;
    }

    if (extensions && !Array.isArray(extensions)) {
      _.log(`«extensions» property of the onDrop config for «${name}» Tool should be an array`);
      extensions = [];
    }

    if (mimeTypes && !Array.isArray(mimeTypes)) {
      _.log(`«mimeTypes» property of the onDrop config for «${name}» Tool should be an array`);
      mimeTypes = [];
    }

    if (mimeTypes) {
      mimeTypes = mimeTypes.filter((type) => {
        if (!_.isValidMimeType(type)) {
          _.log(`MIME type value «${type}» for the «${name}» Tool is not a valid MIME type`, 'warn');
          return false;
        }

        return true;
      });
    }

    this.toolsFiles[name] = {
      extensions: extensions || [],
      mimeTypes: mimeTypes || [],
      handler: fileHandler,
    };
  }

  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param {string} name - Tool name
   * @param {IPasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getPatternsConfig(name: string, toolPasteConfig: IPasteConfig): void {
    if (!toolPasteConfig.patternHandler || _.isEmpty(toolPasteConfig.patterns)) {
      return;
    }

    if (typeof toolPasteConfig.patternHandler !== 'function') {
      _.log(
        `Pattern parser for «${name}» Tool should be a function.`,
        'warn',
      );

      return;
    }

    Object.entries(toolPasteConfig.patterns).forEach(([key, pattern]: [string, RegExp]) => {
      /** Still need to validate pattern as it provided by user */
      if (!(pattern instanceof RegExp)) {
        _.log(
          `Pattern ${pattern} for «${name}» Tool is skipped because it should be a Regexp instance.`,
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
   * Check if Editor should process pasted data and pass data transfer object to handler
   *
   * @param {ClipboardEvent} event
   */
  private handlePasteEvent = async (event: ClipboardEvent): Promise<void> => {
    const {
      Editor: {Sanitizer, BlockManager, Tools, Caret},
    } = this;

    /** If target is native input or is not Block, use browser behaviour */
    if (
      this.isNativeBehaviour(event.target) && !event.clipboardData.types.includes('Files')
    ) {
      return;
    }

    event.preventDefault();
    this.processDataTransfer(event.clipboardData);
  }

  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {DataTransferItemList} items - pasted or dropped items
   */
  private async processFiles(items: DataTransferItemList) {
    const {BlockManager} = this.Editor;

    let dataToInsert: Array<{type: string, data: IBlockToolData}>;

    dataToInsert = await Promise.all(
      Array
        .from(items)
        .map((item) => this.processFile(item)),
    );
    dataToInsert = dataToInsert.filter((data) => !!data);

    dataToInsert.forEach(
      (data, i) => {
        if (i === 0 && BlockManager.currentBlock && BlockManager.currentBlock.isEmpty) {
          BlockManager.replace(data.type, data.data);
          return;
        }

        BlockManager.insert(data.type, data.data);
      },
    );
  }

  /**
   * Get information about file and find Tool to handle it
   *
   * @param {DataTransferItem} item
   */
  private async processFile(item: DataTransferItem) {
    if (item.kind === 'string') {
      return;
    }

    const file = item.getAsFile();
    const extension = _.getFileExtension(file);

    const foundConfig = Object
      .entries(this.toolsFiles)
      .find(([toolName, {mimeTypes, extensions}]) => {
        const [fileType, fileSubtype] = file.type.split('/');

        const foundExt = extensions.find((ext) => ext.toLowerCase() === extension.toLowerCase());
        const foundMimeType = mimeTypes.find((mime) => {
          const [type, subtype] = mime.split('/');

          return type === fileType && (subtype === fileSubtype || subtype === '*');
        });

        return !!foundExt || !!foundMimeType;
      });

    if (!foundConfig) {
      return;
    }

    const [tool, {handler}] = foundConfig;
    return {
      data: await handler(file),
      type: tool,
    };
  }

  /**
   * Process pasted text and divide them into Blocks
   *
   * @param {string} data - text to process. Can be HTML or plain.
   * @param {boolean} isHTML - if passed string is HTML, this parameter should be true
   */
  private async processText(data: string, isHTML: boolean = false) {
    const {Caret, BlockManager} = this.Editor;
    const dataToInsert = isHTML ? this.processHTML(data) : this.processPlain(data);

    if (!dataToInsert.length) {
      return;
    }

    if (dataToInsert.length === 1 && !dataToInsert[0].isBlock) {
      this.processSingleBlock(dataToInsert.pop());
      return;
    }

    /**
     * If caret not at the end of of the Block and there is no selection,
     * we split the Block and insert content at the middle.
     */
    if (SelectionUtils.isAtEditor && !Caret.isAtEnd && SelectionUtils.isCollapsed) {
      this.splitBlock();
    }

    await Promise.all(dataToInsert.map(
      async (content, i) => await this.insertBlock(content, i === 0),
    ));

    Caret.setToBlock(BlockManager.currentBlock, CaretClass.positions.END);
  }

  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML
   * @returns {IPasteData[]}
   */
  private processHTML(innerHTML: string): IPasteData[] {
    const {Tools, Sanitizer} = this.Editor,
      initialTool = this.config.initialBlock,
      wrapper = $.make('DIV');

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
            break;

          /** If node is an element, then there might be a substitution */
          case Node.ELEMENT_NODE:
            content = node as HTMLElement;
            isBlock = true;

            if (this.toolsTags[content.tagName]) {
              tool = this.toolsTags[content.tagName].tool;
            }
            break;
        }

        const {handler, tags} = Tools.blockTools[tool].onPaste;

        const toolTags = tags.reduce((result, tag) => {
          result[tag.toLowerCase()] = {};

          return result;
        }, {});
        const customConfig = Object.assign({}, toolTags, Sanitizer.defaultConfig.tags);

        content.innerHTML = Sanitizer.clean(content.innerHTML, customConfig);

        return {content, isBlock, handler, tool};
      })
      .filter((data) => !$.isNodeEmpty(data.content) || $.isSingleTag(data.content));
  }

  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain
   * @returns {IPasteData[]}
   */
  private processPlain(plain: string): IPasteData[] {
    const {initialBlock} = this.config as {initialBlock: string},
      {Tools} = this.Editor;

    if (!plain) {
      return [];
    }

    const tool = initialBlock,
      handler = Tools.blockTools[tool].onPaste.handler;

    return plain
      .split(/\r?\n/)
      .filter((text) => text.trim())
      .map((text) => {
        const content = $.make('div');

        content.innerHTML = text;

        return {content, tool, isBlock: false, handler};
      });
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
    const initialTool = this.config.initialBlock,
      {BlockManager, Caret} = this.Editor,
      {content, tool} = dataToInsert;

    if (tool === initialTool && content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        this.splitBlock();
        let insertedBlock;

        if (BlockManager.currentBlock && BlockManager.currentBlock.isEmpty) {
          insertedBlock = BlockManager.replace(blockData.tool, blockData.data);
        } else {
          insertedBlock = BlockManager.insert(blockData.tool, blockData.data);
        }
        Caret.setToBlock(insertedBlock, CaretClass.positions.END);
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
    const blockData = await data.handler(data.content),
      {BlockManager, Caret} = this.Editor,
      {currentBlock} = BlockManager;

    if (canReplaceCurrentBlock && currentBlock && currentBlock.isEmpty) {
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

    if (!BlockManager.currentBlock) {
      return;
    }

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
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper
   * @returns {Node[]}
   */
  private getNodes(wrapper: Node): Node[] {
    const children = Array.from(wrapper.childNodes),
      tags = Object.keys(this.toolsTags);

    const reducer = (nodes: Node[], node: Node): Node[] => {
      if ($.isEmpty(node) && !$.isSingleTag(node as HTMLElement)) {
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
            !tags.includes(element.tagName)
          ) {
            destNode.appendChild(element);
            return [...nodes, destNode];
          }

          const {tool = ''} = this.toolsTags[element.tagName] || {};
          const toolTags = this.tagsByTool[tool] || [];

          if (
            (
              tags.includes(element.tagName) &&
              !Array.from(element.children).some(
                ({tagName}) => tags.includes(tagName) && !toolTags.includes(tagName),
              )
            ) || (
              $.blockElements.includes(element.tagName.toLowerCase()) &&
              !Array.from(element.children).some(
                ({tagName}) => {
                  const isBlockElement = $.blockElements.includes(tagName.toLowerCase());
                  const isAnotherToolTags = tags.includes(tagName) && !toolTags.includes(tagName);

                  return isBlockElement || isAnotherToolTags;
                },
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
