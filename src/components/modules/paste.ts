import Module from '../__module';
import $ from '../dom';
import * as _ from '../utils';
import {
  BlockAPI,
  PasteEvent,
  PasteEventDetail,
  SanitizerConfig,
  SanitizerRule
} from '../../../types';
import Block from '../block';
import { SavedData } from '../../../types/data-formats';
import { clean, sanitizeBlocks } from '../utils/sanitizer';
import BlockTool from '../tools/block';

/**
 * Tag substitute object.
 */
interface TagSubstitute {
  /**
   * Name of related Tool
   *
   */
  tool: BlockTool;

  /**
   * If a Tool specifies just a tag name, all the attributes will be sanitized.
   * But Tool can explicitly specify sanitizer configuration for supported tags
   */
  sanitizationConfig?: SanitizerRule;
}

/**
 * Pattern substitute object.
 */
interface PatternSubstitute {
  /**
   * Pattern`s key
   */
  key: string;

  /**
   * Pattern regexp
   */
  pattern: RegExp;

  /**
   * Name of related Tool
   */
  tool: BlockTool;
}

/**
 * Files` types substitutions object.
 */
interface FilesSubstitution {
  /**
   * Array of file extensions Tool can handle
   *
   * @type {string[]}
   */
  extensions: string[];

  /**
   * Array of MIME types Tool can handle
   *
   * @type {string[]}
   */
  mimeTypes: string[];
}

/**
 * Processed paste data object.
 *
 * @interface PasteData
 */
interface PasteData {
  /**
   * Name of related Tool
   *
   * @type {string}
   */
  tool: string;

  /**
   * Pasted data. Processed and wrapped to HTML element
   *
   * @type {HTMLElement}
   */
  content: HTMLElement;

  /**
   * Pasted data
   */
  event: PasteEvent;

  /**
   * True if content should be inserted as new Block
   *
   * @type {boolean}
   */
  isBlock: boolean;
}

/**
 * @class Paste
 * @classdesc Contains methods to handle paste on editor
 * @module Paste
 * @version 2.0.0
 */
export default class Paste extends Module {
  /** If string`s length is greater than this number we don't check paste patterns */
  public static readonly PATTERN_PROCESSING_MAX_LENGTH = 450;

  /** Custom EditorJS mime-type to handle in-editor copy/paste actions */
  public readonly MIME_TYPE = 'application/x-editor-js';

  /**
   * Tags` substitutions parameters
   */
  private toolsTags: { [tag: string]: TagSubstitute } = {};

  /**
   * Store tags to substitute by tool name
   */
  private tagsByTool: { [tools: string]: string[] } = {};

  /** Patterns` substitutions parameters */
  private toolsPatterns: PatternSubstitute[] = [];

  /** Files` substitutions parameters */
  private toolsFiles: {
    [tool: string]: FilesSubstitution;
  } = {};

  /**
   * List of tools which do not need a paste handling
   */
  private exceptionList: string[] = [];

  /**
   * Set onPaste callback and collect tools` paste configurations
   */
  public async prepare(): Promise<void> {
    this.processTools();
  }

  /**
   * Set read-only state
   *
   * @param {boolean} readOnlyEnabled - read only flag value
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.setCallback();
    } else {
      this.unsetCallback();
    }
  }

  /**
   * Handle pasted or dropped data transfer object
   *
   * @param {DataTransfer} dataTransfer - pasted or dropped data transfer object
   * @param {boolean} isDragNDrop - true if data transfer comes from drag'n'drop events
   */
  public async processDataTransfer(dataTransfer: DataTransfer, isDragNDrop = false): Promise<void> {
    const { Tools } = this.Editor;
    const types = dataTransfer.types;

    /**
     * In Microsoft Edge types is DOMStringList. So 'contains' is used to check if 'Files' type included
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const includesFiles = types.includes ? types.includes('Files') : (types as any).contains('Files');

    if (includesFiles && !_.isEmpty(this.toolsFiles)) {
      await this.processFiles(dataTransfer.files);

      return;
    }

    const editorJSData = dataTransfer.getData(this.MIME_TYPE);
    const plainData = dataTransfer.getData('text/plain');
    let htmlData = dataTransfer.getData('text/html');

    /**
     * If EditorJS json is passed, insert it
     */
    if (editorJSData) {
      try {
        this.insertEditorJSData(JSON.parse(editorJSData));

        return;
      } catch (e) { } // Do nothing and continue execution as usual if error appears
    }

    /**
     *  If text was drag'n'dropped, wrap content with P tag to insert it as the new Block
     */
    if (isDragNDrop && plainData.trim() && htmlData.trim()) {
      htmlData = '<p>' + (htmlData.trim() ? htmlData : plainData) + '</p>';
    }

    /** Add all tags that can be substituted to sanitizer configuration */
    const toolsTags = Object.keys(this.toolsTags).reduce((result, tag) => {
      /**
       * If Tool explicitly specifies sanitizer configuration for the tag, use it.
       * Otherwise, remove all attributes
       */
      result[tag.toLowerCase()] = this.toolsTags[tag].sanitizationConfig ?? {};

      return result;
    }, {});

    const customConfig = Object.assign({}, toolsTags, Tools.getAllInlineToolsSanitizeConfig(), { br: {} });
    const cleanData = clean(htmlData, customConfig);

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
  public async processText(data: string, isHTML = false): Promise<void> {
    const { Caret, BlockManager } = this.Editor;
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

    const isCurrentBlockDefault = BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;
    const needToReplaceCurrentBlock = isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;

    dataToInsert.map(
      async (content, i) => this.insertBlock(content, i === 0 && needToReplaceCurrentBlock)
    );

    if (BlockManager.currentBlock) {
      Caret.setToBlock(BlockManager.currentBlock, Caret.positions.END);
    }
  }

  /**
   * Set onPaste callback handler
   */
  private setCallback(): void {
    this.listeners.on(this.Editor.UI.nodes.holder, 'paste', this.handlePasteEvent);
  }

  /**
   * Unset onPaste callback handler
   */
  private unsetCallback(): void {
    this.listeners.off(this.Editor.UI.nodes.holder, 'paste', this.handlePasteEvent);
  }

  /**
   * Get and process tool`s paste configs
   */
  private processTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Array
      .from(tools.values())
      .forEach(this.processTool);
  }

  /**
   * Process paste config for each tool
   *
   * @param tool - BlockTool object
   */
  private processTool = (tool: BlockTool): void => {
    try {
      const toolInstance = tool.create({}, {} as BlockAPI, false);

      if (tool.pasteConfig === false) {
        this.exceptionList.push(tool.name);

        return;
      }

      if (!_.isFunction(toolInstance.onPaste)) {
        return;
      }

      this.getTagsConfig(tool);
      this.getFilesConfig(tool);
      this.getPatternsConfig(tool);
    } catch (e) {
      _.log(
        `Paste handling for «${tool.name}» Tool hasn't been set up because of the error`,
        'warn',
        e
      );
    }
  };

  /**
   * Get tags name list from either tag name or sanitization config.
   *
   * @param {string | object} tagOrSanitizeConfig - tag name or sanitize config object.
   * @returns {string[]} array of tags.
   */
  private collectTagNames(tagOrSanitizeConfig: string | SanitizerConfig): string[] {
    /**
     * If string, then it is a tag name.
     */
    if (_.isString(tagOrSanitizeConfig)) {
      return [ tagOrSanitizeConfig ];
    }
    /**
     * If object, then its keys are tags.
     */
    if (_.isObject(tagOrSanitizeConfig)) {
      return Object.keys(tagOrSanitizeConfig);
    }

    /** Return empty tag list */
    return [];
  }

  /**
   * Get tags to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  private getTagsConfig(tool: BlockTool): void {
    const tagsOrSanitizeConfigs = tool.pasteConfig.tags || [];
    const toolTags = [];

    tagsOrSanitizeConfigs.forEach((tagOrSanitizeConfig) => {
      const tags = this.collectTagNames(tagOrSanitizeConfig);

      /**
       * Add tags to toolTags array
       */
      toolTags.push(...tags);
      tags.forEach((tag) => {
        if (Object.prototype.hasOwnProperty.call(this.toolsTags, tag)) {
          _.log(
            `Paste handler for «${tool.name}» Tool on «${tag}» tag is skipped ` +
            `because it is already used by «${this.toolsTags[tag].tool.name}» Tool.`,
            'warn'
          );

          return;
        }
        /**
         * Get sanitize config for tag.
         */
        const sanitizationConfig = _.isObject(tagOrSanitizeConfig) ? tagOrSanitizeConfig[tag] : null;

        this.toolsTags[tag.toUpperCase()] = {
          tool,
          sanitizationConfig,
        };
      });
    });

    this.tagsByTool[tool.name] = toolTags.map((t) => t.toUpperCase());
  }

  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  private getFilesConfig(tool: BlockTool): void {
    const { files = {} } = tool.pasteConfig;
    let { extensions, mimeTypes } = files;

    if (!extensions && !mimeTypes) {
      return;
    }

    if (extensions && !Array.isArray(extensions)) {
      _.log(`«extensions» property of the onDrop config for «${tool.name}» Tool should be an array`);
      extensions = [];
    }

    if (mimeTypes && !Array.isArray(mimeTypes)) {
      _.log(`«mimeTypes» property of the onDrop config for «${tool.name}» Tool should be an array`);
      mimeTypes = [];
    }

    if (mimeTypes) {
      mimeTypes = mimeTypes.filter((type) => {
        if (!_.isValidMimeType(type)) {
          _.log(`MIME type value «${type}» for the «${tool.name}» Tool is not a valid MIME type`, 'warn');

          return false;
        }

        return true;
      });
    }

    this.toolsFiles[tool.name] = {
      extensions: extensions || [],
      mimeTypes: mimeTypes || [],
    };
  }

  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  private getPatternsConfig(tool: BlockTool): void {
    if (!tool.pasteConfig.patterns || _.isEmpty(tool.pasteConfig.patterns)) {
      return;
    }

    Object.entries(tool.pasteConfig.patterns).forEach(([key, pattern]: [string, RegExp]) => {
      /** Still need to validate pattern as it provided by user */
      if (!(pattern instanceof RegExp)) {
        _.log(
          `Pattern ${pattern} for «${tool.name}» Tool is skipped because it should be a Regexp instance.`,
          'warn'
        );
      }

      this.toolsPatterns.push({
        key,
        pattern,
        tool,
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
   * @param {ClipboardEvent} event - clipboard event
   */
  private handlePasteEvent = async (event: ClipboardEvent): Promise<void> => {
    const { BlockManager, Toolbar } = this.Editor;

    /** If target is native input or is not Block, use browser behaviour */
    if (
      !BlockManager.currentBlock || (this.isNativeBehaviour(event.target) && !event.clipboardData.types.includes('Files'))
    ) {
      return;
    }

    /**
     * If Tools is in list of errors, skip processing of paste event
     */
    if (BlockManager.currentBlock && this.exceptionList.includes(BlockManager.currentBlock.name)) {
      return;
    }

    event.preventDefault();
    this.processDataTransfer(event.clipboardData);

    BlockManager.clearFocused();
    Toolbar.close();
  };

  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {FileList} items - pasted or dropped items
   */
  private async processFiles(items: FileList): Promise<void> {
    const { BlockManager } = this.Editor;

    let dataToInsert: { type: string; event: PasteEvent }[];

    dataToInsert = await Promise.all(
      Array
        .from(items)
        .map((item) => this.processFile(item))
    );
    dataToInsert = dataToInsert.filter((data) => !!data);

    const isCurrentBlockDefault = BlockManager.currentBlock.tool.isDefault;
    const needToReplaceCurrentBlock = isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;

    dataToInsert.forEach(
      (data, i) => {
        BlockManager.paste(data.type, data.event, i === 0 && needToReplaceCurrentBlock);
      }
    );
  }

  /**
   * Get information about file and find Tool to handle it
   *
   * @param {File} file - file to process
   */
  private async processFile(file: File): Promise<{ event: PasteEvent; type: string }> {
    const extension = _.getFileExtension(file);

    const foundConfig = Object
      .entries(this.toolsFiles)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      .find(([toolName, { mimeTypes, extensions } ]) => {
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

    const [ tool ] = foundConfig;
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
   * @param {string} innerHTML - html string to process
   * @returns {PasteData[]}
   */
  private processHTML(innerHTML: string): PasteData[] {
    const { Tools } = this.Editor;

    /**
     * @todo Research, do we really need to always wrap innerHTML to a div:
     *  - <img> tag could be processed separately, but for now it becomes div-wrapped
     *    and then .getNodes() returns strange: [document-fragment, img]
     *    (description of the method says that it should should return only block tags or fragments,
     *     but there are inline-block element along with redundant empty fragment)
     *  - probably this is a reason of bugs with unexpected new block creation instead of inline pasting:
     *      - https://github.com/codex-team/editor.js/issues/1427
     *      - https://github.com/codex-team/editor.js/issues/1244
     *      - https://github.com/codex-team/editor.js/issues/740
     */
    const wrapper = $.make('DIV');

    wrapper.innerHTML = innerHTML;

    const nodes = this.getNodes(wrapper);

    return nodes
      .map((node) => {
        let content, tool = Tools.defaultTool, isBlock = false;

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

        const { tags: tagsOrSanitizeConfigs } = tool.pasteConfig;

        /**
         * Reduce the tags or sanitize configs to a single array of sanitize config.
         * For example:
         * If sanitize config is
         * [ 'tbody',
         *   {
         *     table: {
         *       width: true,
         *       height: true,
         *     },
         *   },
         *   {
         *      td: {
         *        colspan: true,
         *        rowspan: true,
         *      },
         *      tr: {  // <-- the second tag
         *        height: true,
         *      },
         *   },
         * ]
         * then sanitize config will be
         * [
         *  'table':{},
         *  'tbody':{width: true, height: true}
         *  'td':{colspan: true, rowspan: true},
         *  'tr':{height: true}
         * ]
         */
        const toolTags = tagsOrSanitizeConfigs.reduce((result, tagOrSanitizeConfig) => {
          const tags = this.collectTagNames(tagOrSanitizeConfig);

          tags.forEach((tag) => {
            const sanitizationConfig = _.isObject(tagOrSanitizeConfig) ? tagOrSanitizeConfig[tag] : null;

            result[tag.toLowerCase()] = sanitizationConfig || {};
          });

          return result;
        }, {});

        const customConfig = Object.assign({}, toolTags, tool.baseSanitizeConfig);

        /**
         * A workaround for the HTMLJanitor bug with Tables (incorrect sanitizing of table.innerHTML)
         * https://github.com/guardian/html-janitor/issues/3
         */
        if (content.tagName.toLowerCase() === 'table') {
          const cleanTableHTML = clean(content.outerHTML, customConfig);
          const tmpWrapper = $.make('div', undefined, {
            innerHTML: cleanTableHTML,
          });

          content = tmpWrapper.firstChild;
        } else {
          content.innerHTML = clean(content.innerHTML, customConfig);
        }

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {
          content,
          isBlock,
          tool: tool.name,
          event,
        };
      })
      .filter((data) => {
        const isEmpty = $.isEmpty(data.content);
        const isSingleTag = $.isSingleTag(data.content);

        return !isEmpty || isSingleTag;
      });
  }

  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain - string to process
   * @returns {PasteData[]}
   */
  private processPlain(plain: string): PasteData[] {
    const { defaultBlock } = this.config as { defaultBlock: string };

    if (!plain) {
      return [];
    }

    const tool = defaultBlock;

    return plain
      .split(/\r?\n/)
      .filter((text) => text.trim())
      .map((text) => {
        const content = $.make('div');

        content.textContent = text;

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {
          content,
          tool,
          isBlock: false,
          event,
        };
      });
  }

  /**
   * Process paste of single Block tool content
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  private async processSingleBlock(dataToInsert: PasteData): Promise<void> {
    const { Caret, BlockManager } = this.Editor;
    const { currentBlock } = BlockManager;

    /**
     * If pasted tool isn`t equal current Block or if pasted content contains block elements, insert it as new Block
     */
    if (
      !currentBlock ||
      dataToInsert.tool !== currentBlock.name ||
      !$.containsOnlyInlineElements(dataToInsert.content.innerHTML)
    ) {
      this.insertBlock(dataToInsert, currentBlock?.tool.isDefault && currentBlock.isEmpty);

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
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  private async processInlinePaste(dataToInsert: PasteData): Promise<void> {
    const { BlockManager, Caret } = this.Editor;
    const { content } = dataToInsert;

    const currentBlockIsDefault = BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;

    if (currentBlockIsDefault && content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        const needToReplaceCurrentBlock = BlockManager.currentBlock &&
          BlockManager.currentBlock.tool.isDefault &&
          BlockManager.currentBlock.isEmpty;

        const insertedBlock = BlockManager.paste(blockData.tool, blockData.event, needToReplaceCurrentBlock);

        Caret.setToBlock(insertedBlock, Caret.positions.END);

        return;
      }
    }

    /** If there is no pattern substitute - insert string as it is */
    if (BlockManager.currentBlock && BlockManager.currentBlock.currentInput) {
      const currentToolSanitizeConfig = BlockManager.currentBlock.tool.baseSanitizeConfig;

      document.execCommand(
        'insertHTML',
        false,
        clean(content.innerHTML, currentToolSanitizeConfig)
      );
    } else {
      this.insertBlock(dataToInsert);
    }
  }

  /**
   * Get patterns` matches
   *
   * @param {string} text - text to process
   * @returns {Promise<{event: PasteEvent, tool: string}>}
   */
  private async processPattern(text: string): Promise<{ event: PasteEvent; tool: string }> {
    const pattern = this.toolsPatterns.find((substitute) => {
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
      tool: pattern.tool.name,
    };
  }

  /**
   * Insert pasted Block content to Editor
   *
   * @param {PasteData} data - data to insert
   * @param {boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {void}
   */
  private insertBlock(data: PasteData, canReplaceCurrentBlock = false): void {
    const { BlockManager, Caret } = this.Editor;
    const { currentBlock } = BlockManager;
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
   * Insert data passed as application/x-editor-js JSON
   *
   * @param {Array} blocks — Blocks' data to insert
   * @returns {void}
   */
  private insertEditorJSData(blocks: Pick<SavedData, 'id' | 'data' | 'tool'>[]): void {
    const { BlockManager, Caret, Tools } = this.Editor;
    const sanitizedBlocks = sanitizeBlocks(blocks, (name) =>
      Tools.blockTools.get(name).sanitizeConfig
    );

    sanitizedBlocks.forEach(({ tool, data }, i) => {
      let needToReplaceCurrentBlock = false;

      if (i === 0) {
        const isCurrentBlockDefault = BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;

        needToReplaceCurrentBlock = isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;
      }

      const block = BlockManager.insert({
        tool,
        data,
        replace: needToReplaceCurrentBlock,
      });

      Caret.setToBlock(block, Caret.positions.END);
    });
  }

  /**
   * Fetch nodes from Element node
   *
   * @param {Node} node - current node
   * @param {Node[]} nodes - processed nodes
   * @param {Node} destNode - destination node
   */
  private processElementNode(node: Node, nodes: Node[], destNode: Node): Node[] | void {
    const tags = Object.keys(this.toolsTags);

    const element = node as HTMLElement;

    const { tool } = this.toolsTags[element.tagName] || {};
    const toolTags = this.tagsByTool[tool?.name] || [];

    const isSubstitutable = tags.includes(element.tagName);
    const isBlockElement = $.blockElements.includes(element.tagName.toLowerCase());
    const containsAnotherToolTags = Array
      .from(element.children)
      .some(
        ({ tagName }) => tags.includes(tagName) && !toolTags.includes(tagName)
      );

    const containsBlockElements = Array.from(element.children).some(
      ({ tagName }) => $.blockElements.includes(tagName.toLowerCase())
    );

    /** Append inline elements to previous fragment */
    if (!isBlockElement && !isSubstitutable && !containsAnotherToolTags) {
      destNode.appendChild(element);

      return [...nodes, destNode];
    }

    if (
      (isSubstitutable && !containsAnotherToolTags) ||
      (isBlockElement && !containsBlockElements && !containsAnotherToolTags)
    ) {
      return [...nodes, destNode, element];
    }
  }

  /**
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper - wrapper of paster HTML content
   * @returns {Node[]}
   */
  private getNodes(wrapper: Node): Node[] {
    const children = Array.from(wrapper.childNodes);
    let elementNodeProcessingResult: Node[] | void;

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
          elementNodeProcessingResult = this.processElementNode(node, nodes, destNode);

          if (elementNodeProcessingResult) {
            return elementNodeProcessingResult;
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
   * @param {string} type - event type
   * @param {PasteEventDetail} detail - event detail
   */
  private composePasteEvent(type: string, detail: PasteEventDetail): PasteEvent {
    return new CustomEvent(type, {
      detail,
    }) as PasteEvent;
  }
}

