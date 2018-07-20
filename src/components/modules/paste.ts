declare const Module: any;
declare const $: any;
declare const _: any;

interface IBlockData {
  tool: string;
  data: any;
}

interface IPasteConfig {
  handler: (content: HTMLElement) => IBlockData;
  tags?: string[];
  patterns?: RegExp[];
  patternHandler?: (text: string, pattern: RegExp) => IBlockData;
}

interface ITagSubstitute {
  tool: string;
  handler: (element: HTMLElement) => IBlockData;
}

interface IPatternSubstitute {
  key: string;
  pattern: RegExp;
  handler: (text: string, key: string) => IBlockData;
  tool: string;
}

interface IPasteData {
  tool: string;
  content: HTMLElement;
  isBlock: boolean;
  handler: (content: HTMLElement|string, patten?: RegExp) => IBlockData;
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
    Object.values(tools).forEach(this.processTool);
  }

  /**
   * Process paste config for each tools
   *
   * @param {string} tool
   */
  private processTool = (tool) => {

    const toolPasteConfig = tool.onPaste || {};

    if (!toolPasteConfig.handler) {
      _.log(
        `"${tool.name}" Tool MUST provide paste handler.`,
        'warn',
      );
    }

    if (typeof toolPasteConfig.handler !== 'function') {
      _.log(
        `Paste handler for "${tool.name}" Tool should be a function.`,
        'warn',
      );
    } else {
      const tags = toolPasteConfig.tags || [];

      tags.forEach((tag) => {
        if (this.toolsTags.hasOwnProperty(tag)) {
          _.log(
            `Paste handler for "${tool.name}" Tool on "${tag}" tag is skipped ` +
            `because it is already used by "${this.toolsTags[tag].tool}" Tool.`,
            'warn',
          );
          return;
        }

        this.toolsTags[tag] = {
          handler: toolPasteConfig.handler,
          tool: tool.name.toLowerCase(),
        };
      });
    }

    if (!toolPasteConfig.patternHandler || _.isEmpty(toolPasteConfig.patterns)) {
      return;
    }

    if (typeof toolPasteConfig.patternHandler !== 'function') {
      _.log(
        `Pattern parser for "${tool.name}" Tool should be a function.`,
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
          tool: tool.name.toLowerCase(),
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
  private processPastedData = (event: ClipboardEvent): void => {
    const {
      Editor: {Tools, Sanitizer, BlockManager},
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
    if (!toolConfig || toolConfig[Tools.apiSettings.IS_PASTE_DISALLOWED]) {
      return;
    }

    const htmlData  = event.clipboardData.getData('text/html'),
          plainData = event.clipboardData.getData('text/plain');

    /** Add all tags can be substituted to sanitizer configuration */
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

    Promise.all(dataToInsert.map(async (data) => await this.insertBlock(data)));
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
    const {BlockManager, BlockManager: {currentBlock}} = this.Editor;
    const {content, tool} = dataToInsert;

    if (tool === initialTool && content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        BlockManager.insert(blockData.tool, blockData.data);
        return;
      }
    }

    if (tool !== currentBlock.name) {
      this.insertBlock(dataToInsert);
      return;
    }

    document.execCommand('insertHTML', false, content.innerHTML);
  }

  /**
   * Get patterns` matches
   *
   * @param {string} text
   * @returns Promise<IBlockData>
   */
  private async processPattern(text: string): Promise<IBlockData> {
    const pattern =  this.toolsPatterns.find((substitute) => {
      const execResult = substitute.pattern.exec(text);

      if (!execResult) {
        return false;
      }

      return text === execResult.shift();
    });

    console.log(pattern);

    const data = pattern && await pattern.handler(text, pattern.key);

    console.log(data);

    return data && {
      data,
      tool: pattern.tool,
    };
  }

  /**
   *
   * @param {IPasteData} data
   * @returns {Promise<void>}
   */
  private async insertBlock(data: IPasteData): Promise<void> {
    const blockData = await data.handler(data.content);
    const {BlockManager} = this.Editor;

    BlockManager.insert(data.tool, blockData);
  }

  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML
   * @returns IPasteData[]
   */
  private processHTML(innerHTML: string): IPasteData[] {
    const {Tools, Sanitizer} = this.Editor;
    const initialTool = this.config.initialBlock;
    const wrapper = $.make('DIV');

    wrapper.innerHTML = innerHTML;

    const nodes = this.getNodes(wrapper);

    return nodes.map((node) => {
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
    });
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

      content.innerHTML = plain;
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

    console.log(children);

    const reducer = (nodes: Node[], node: Node): Node[] => {
      if ($.isEmpty(node)) {
        return nodes;
      }

      console.log(nodes);

      const lastNode = nodes[nodes.length - 1];
      let destNode: Node = new DocumentFragment();

      if (lastNode && $.isFragment(lastNode)) {
        destNode = nodes.pop();
      }

      console.log(destNode);
      switch (node.nodeType) {
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
