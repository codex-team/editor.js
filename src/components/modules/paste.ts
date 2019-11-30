import Module from '../__module';
import $ from '../dom';
import * as _ from '../utils';
import {
  BlockTool,
  BlockToolConstructable,
  PasteConfig,
  PasteEvent,
  PasteEventDetail,
} from '../../../types';
import Block from '../block';

/**
 * Tag substitute object.
 */
interface TagSubstitute {
  /**
   * Name of related Tool
   * @type {string}
   */
  tool: string;
}

/**
 * Pattern substitute object.
 */
interface PatternSubstitute {
  /**
   * Pattern`s key
   * @type {string}
   */
  key: string;

  /**
   * Pattern regexp
   * @type {RegExp}
   */
  pattern: RegExp;

  /**
   * Name of related Tool
   * @type {string}
   */
  tool: string;
}

/**
 * Files` types substitutions object.
 */
interface FilesSubstitution {
  /**
   * Array of file extensions Tool can handle
   * @type {string[]}
   */
  extensions: string[];

  /**
   * Array of MIME types Tool can handle
   * @type {string[]}
   */
  mimeTypes: string[];
}

/**
 * Processed paste data object.
 */
interface PasteData {
  /**
   * Name of related Tool
   * @type {string}
   */
  tool: string;

  /**
   * Pasted data. Processed and wrapped to HTML element
   * @type {HTMLElement}
   */
  content: HTMLElement;

  /**
   * Pasted data
   */
  event: PasteEvent;

  /**
   * True if content should be inserted as new Block
   * @type {boolean}
   */
  isBlock: boolean;
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
  private toolsTags: {[tag: string]: TagSubstitute} = {};

  /**
   * Store tags to substitute by tool name
   */
  private tagsByTool: {[tools: string]: string[]} = {};

  /** Patterns` substitutions parameters */
  private toolsPatterns: PatternSubstitute[] = [];

  /** Files` substitutions parameters */
  private toolsFiles: {
    [tool: string]: FilesSubstitution,
  } = {};

  /**
   * List of tools which do not need a paste handling
   */
  private exceptionList: string[] = [];

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
   * @param {boolean} isDragNDrop
   */
  public async processDataTransfer(dataTransfer: DataTransfer, isDragNDrop = false): Promise<void> {
    const { Sanitizer } = this.Editor;

    const types = dataTransfer.types;

    /**
     * In Microsoft Edge types is DOMStringList. So 'contains' is used to check if 'Files' type included
     */
    const includesFiles = types.includes ? types.includes('Files') : (types as any).contains('Files');

    if (includesFiles) {
      await this.processFiles(dataTransfer.files);
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

    const customConfig = Object.assign({}, toolsTags, Sanitizer.getAllInlineToolsConfig(), {br: {}});

    const cleanData = Sanitizer.clean(htmlData, customConfig);

    /** If there is no HTML or HTML string is equal to plain one, process it as plain text */
    if (!cleanData.trim() || cleanData.trim() === plainData || !$.isHTMLString(cleanData)) {
      await this.processText(plainData);
    } else {
      await this.processText(cleanData, true);
    }
  }

  /**
   * Process pasted text and divide them into Blocks
   *
   * @param {string} data - text to process. Can be HTML or plain.
   * @param {boolean} isHTML - if passed string is HTML, this parameter should be true
   */
  public async processText(data: string, isHTML: boolean = false) {
    const {Caret, BlockManager, Tools} = this.Editor;
    const dataToInsert = isHTML ? this.processHTML(data) : this.processPlain(data);

    if (!dataToInsert.length) {
      return;
    }

    if (dataToInsert.length === 1) {
      if (!dataToInsert[0].isBlock) {
        this.processInlinePaste(dataToInsert.pop());
      } else {
        this.processSingleBlock(dataToInsert.pop());
      }
      return;
    }

    const isCurrentBlockInitial = BlockManager.currentBlock && Tools.isInitial(BlockManager.currentBlock.tool);
    const needToReplaceCurrentBlock = isCurrentBlockInitial && BlockManager.currentBlock.isEmpty;

    await Promise.all(dataToInsert.map(
      async (content, i) => await this.insertBlock(content, i === 0 && needToReplaceCurrentBlock),
    ));

    if (BlockManager.currentBlock) {
      Caret.setToBlock(BlockManager.currentBlock, Caret.positions.END);
    }
  }

  /**
   * Set onPaste callback handler
   */
  private setCallback(): void {
    const {Listeners} = this.Editor;

    Listeners.on(document, 'paste', this.handlePasteEvent);
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
  private processTool = ([name, tool]: [string, BlockToolConstructable]): void => {
    try {
      const toolInstance = new this.Editor.Tools.blockTools[name]({
        api: this.Editor.API.methods,
        config: {},
        data: {},
      }) as BlockTool;

      if (tool.pasteConfig === false) {
        this.exceptionList.push(name);
        return;
      }

      if (typeof toolInstance.onPaste !== 'function') {
        return;
      }

      const toolPasteConfig = tool.pasteConfig || {};

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
   * @param {PasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getTagsConfig(name: string, toolPasteConfig: PasteConfig): void {
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
        tool: name,
      };
    });

    this.tagsByTool[name] = tags.map((t) => t.toUpperCase());
  }

  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param {string} name - Tool name
   * @param {PasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getFilesConfig(name: string, toolPasteConfig: PasteConfig): void {

    const {files = {}} = toolPasteConfig;
    let {extensions, mimeTypes} = files;

    if (!extensions && !mimeTypes) {
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
    };
  }

  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param {string} name - Tool name
   * @param {PasteConfig} toolPasteConfig - Tool onPaste configuration
   */
  private getPatternsConfig(name: string, toolPasteConfig: PasteConfig): void {
    if (!toolPasteConfig.patterns || _.isEmpty(toolPasteConfig.patterns)) {
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
    return $.isNativeInput(element);
  }

  /**
   * Check if Editor should process pasted data and pass data transfer object to handler
   *
   * @param {ClipboardEvent} event
   */
  private handlePasteEvent = async (event: ClipboardEvent): Promise<void> => {
    const {BlockManager, Toolbar} = this.Editor;

    /** If target is native input or is not Block, use browser behaviour */
    if (
      !BlockManager.currentBlock ||
      this.isNativeBehaviour(event.target) && !event.clipboardData.types.includes('Files')
    ) {
      return;
    }

    /**
     * If Tools is in list of exceptions, skip processing of paste event
     */
    if (BlockManager.currentBlock && this.exceptionList.includes(BlockManager.currentBlock.name)) {
      return;
    }

    event.preventDefault();
    this.processDataTransfer(event.clipboardData);

    BlockManager.clearFocused();
    Toolbar.close();
  }

  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {FileList} items - pasted or dropped items
   */
  private async processFiles(items: FileList) {
    const {BlockManager, Tools} = this.Editor;

    let dataToInsert: Array<{type: string, event: PasteEvent}>;

    dataToInsert = await Promise.all(
      Array
        .from(items)
        .map((item) => this.processFile(item)),
    );
    dataToInsert = dataToInsert.filter((data) => !!data);

    const isCurrentBlockInitial = Tools.isInitial(BlockManager.currentBlock.tool);
    const needToReplaceCurrentBlock = isCurrentBlockInitial && BlockManager.currentBlock.isEmpty;

    dataToInsert.forEach(
      (data, i) => {
        BlockManager.paste(data.type, data.event, i === 0 && needToReplaceCurrentBlock);
      },
    );
  }

  /**
   * Get information about file and find Tool to handle it
   *
   * @param {File} file
   */
  private async processFile(file: File) {
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

    const [tool] = foundConfig;
    const pasteEvent = this.composePasteEvent('file', {
      file,
    });

    return {
      event: pasteEvent,
      type: tool,
    };
  }

  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML
   * @returns {PasteData[]}
   */
  private processHTML(innerHTML: string): PasteData[] {
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

        const {tags} = Tools.blockTools[tool].pasteConfig as PasteConfig;

        const toolTags = tags.reduce((result, tag) => {
          result[tag.toLowerCase()] = {};

          return result;
        }, {});
        const customConfig = Object.assign({}, toolTags, Sanitizer.getInlineToolsConfig(tool));

        content.innerHTML = Sanitizer.clean(content.innerHTML, customConfig);

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {content, isBlock, tool, event};
      })
      .filter((data) => !$.isNodeEmpty(data.content) || $.isSingleTag(data.content));
  }

  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain
   * @returns {PasteData[]}
   */
  private processPlain(plain: string): PasteData[] {
    const {initialBlock} = this.config as {initialBlock: string},
      {Tools} = this.Editor;

    if (!plain) {
      return [];
    }

    const tool = initialBlock;

    return plain
      .split(/\r?\n/)
      .filter((text) => text.trim())
      .map((text) => {
        const content = $.make('div');

        content.innerHTML = text;

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {content, tool, isBlock: false, event};
      });
  }

  /**
   * Process paste of single Block tool content
   *
   * @param {PasteData} dataToInsert
   */
  private async processSingleBlock(dataToInsert: PasteData): Promise<void> {
    const {Caret, BlockManager, Tools} = this.Editor;
    const {currentBlock} = BlockManager;

    /**
     * If pasted tool isn`t equal current Block or if pasted content contains block elements, insert it as new Block
     */
    if (
      !currentBlock ||
      dataToInsert.tool !== currentBlock.name ||
      !$.containsOnlyInlineElements(dataToInsert.content.innerHTML)
    ) {
      this.insertBlock(dataToInsert, currentBlock && Tools.isInitial(currentBlock.tool) && currentBlock.isEmpty);
      return;
    }

    Caret.insertContentAtCaretPosition(dataToInsert.content.innerHTML);
  }

  /**
   * Process paste to single Block:
   * 1. Find patterns` matches
   * 2. Insert new block if it is not the same type as current one
   * 3. Just insert text if there is no substitutions
   *
   * @param {PasteData} dataToInsert
   */
  private async processInlinePaste(dataToInsert: PasteData): Promise<void> {
    const {BlockManager, Caret, Sanitizer, Tools} = this.Editor;
    const {content, tool} = dataToInsert;

    const currentBlockIsInitial = BlockManager.currentBlock && Tools.isInitial(BlockManager.currentBlock.tool);

    if (currentBlockIsInitial && content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        let insertedBlock;

        const needToReplaceCurrentBlock = BlockManager.currentBlock
          && Tools.isInitial(BlockManager.currentBlock.tool)
          && BlockManager.currentBlock.isEmpty;

        insertedBlock = BlockManager.paste(blockData.tool, blockData.event, needToReplaceCurrentBlock);

        Caret.setToBlock(insertedBlock, Caret.positions.END);
        return;
      }
    }

    /** If there is no pattern substitute - insert string as it is */
    if (BlockManager.currentBlock && BlockManager.currentBlock.currentInput) {
      const currentToolSanitizeConfig = Sanitizer.getInlineToolsConfig(BlockManager.currentBlock.name);

      document.execCommand('insertHTML', false, Sanitizer.clean(content.innerHTML, currentToolSanitizeConfig));
    } else {
      this.insertBlock(dataToInsert);
    }
  }

  /**
   * Get patterns` matches
   *
   * @param {string} text
   * @returns Promise<{data: BlockToolData, tool: string}>
   */
  private async processPattern(text: string): Promise<{event: PasteEvent, tool: string}> {
    const pattern =  this.toolsPatterns.find((substitute) => {
      const execResult = substitute.pattern.exec(text);

      if (!execResult) {
        return false;
      }

      return text === execResult.shift();
    });

    if (!pattern) {
      return;
    }

    const event = this.composePasteEvent('pattern', {
      key: pattern.key,
      data: text,
    });

    return {
      event,
      tool: pattern.tool,
    };
  }

  /**
   *
   * @param {PasteData} data
   * @param {Boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {Promise<void>}
   */
  private async insertBlock(data: PasteData, canReplaceCurrentBlock: boolean = false): Promise<void> {
    const {BlockManager, Caret} = this.Editor;
    const {currentBlock} = BlockManager;
    let block: Block;

    if (canReplaceCurrentBlock && currentBlock && currentBlock.isEmpty) {
      block = BlockManager.paste(data.tool, data.event, true);
      Caret.setToBlock(block, Caret.positions.END);
      return;
    }

    block = BlockManager.paste(data.tool, data.event);

    Caret.setToBlock(block, Caret.positions.END);
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

          if (element.tagName === 'BR') {
            return [...nodes, destNode, new DocumentFragment()];
          }

          const {tool = ''} = this.toolsTags[element.tagName] || {};
          const toolTags = this.tagsByTool[tool] || [];

          const isSubstitutable = tags.includes(element.tagName);
          const isBlockElement = $.blockElements.includes(element.tagName.toLowerCase());
          const containsAnotherToolTags = Array
                                              .from(element.children)
                                              .some(
                                                ({tagName}) => tags.includes(tagName) && !toolTags.includes(tagName),
                                              );

          const containsBlockElements = Array.from(element.children).some(
            ({tagName}) => $.blockElements.includes(tagName.toLowerCase()),
          );

          /** Append inline elements to previous fragment */
          if (!isBlockElement && !isSubstitutable && !containsAnotherToolTags) {
            destNode.appendChild(element);
            return [...nodes, destNode];
          }

          if (
            (isSubstitutable && !containsAnotherToolTags) ||
            (isBlockElement && !containsBlockElements && !containsAnotherToolTags )
          ) {
            return [...nodes, destNode, element];
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

  /**
   * Compose paste event with passed type and detail
   *
   * @param {string} type
   * @param {PasteEventDetail} detail
   */
  private composePasteEvent(type: string, detail: PasteEventDetail): PasteEvent {
    return new CustomEvent(type, {
      detail,
    }) as PasteEvent;
  }
}
