declare const Module: any;
declare const $: any;
declare const _: any;

interface IPasteConfig {
    tags?: string[];
    tagHandler?: (element: HTMLElement) => any;
    allowedAttributes: string[];
    patterns?: RegExp[];
    patternHandler?: (pattern: string) => any;
}

interface ITagSubstitute {
    tool: string;
    attributes: {[name: string]: any};
    handler: (element: HTMLElement) => any;
}

interface IPatternSubstitute {
    pattern: RegExp;
    handler: (text: string, pattern: RegExp) => any;
    tool: string;
}

interface IBlockData {
    tool: string;
    data: any;
}

interface IInitialBlockData extends IBlockData {
    data: {
        text: string,
    };
}

export default class Paste extends Module {

    /** If string`s length is greater than this number we don't process it */
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
        this.processConfigs();

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
    private processConfigs(): void {

        const {toolsConfig} = this.config;

        Object
            .entries(toolsConfig)
            .forEach(([name, config]: [string, {onPaste?: IPasteConfig}]) => {
            if (config && config.onPaste) {
                this.processConfig(name, config.onPaste);
            }
        });

    }

    /**
     * Process paste config for each tools
     *
     * @param {string} tool
     * @param {IPasteConfig} config
     */
    private processConfig(tool: string, config: IPasteConfig): void {

        if (typeof config.tagHandler !== 'function') {
            _.log(
                `Paste handler for "${tool}" Tool should be a function.`,
                'warn',
            );

        } else {
            config.tags.forEach((tag) => {
                if (this.toolsTags.hasOwnProperty(tag)) {
                    _.log(
                        `Paste handler for "${tool}" Tool on "${tag}" tag is skipped ` +
                        `because it is already used by "${this.toolsTags.tool}" Tool.`,
                        'warn',
                    );
                    return;
                }

                this.toolsTags[tag] = {
                    attributes: config.allowedAttributes || {},
                    handler: config.tagHandler,
                    tool,
                };
            });
        }

        if (typeof config.patternHandler !== 'function') {
            _.log(
                `Pattern handler for "${tool}" Tool should be a function.`,
                'warn',
            );
        } else {
            config.patterns.forEach((pattern: RegExp) => {

                /** Still need to validate pattern as it provided by user */
                if (!(pattern instanceof RegExp)) {
                    _.log(
                        `Pattern ${pattern} for "${tool}" Tool is skipped because it should be a Regexp instance.`,
                        'warn',
                    );
                }

                this.toolsPatterns.push({
                    handler: config.patternHandler,
                    pattern,
                    tool,
                });
            });
        }
    }

    /**
     * Check if browser behavior suits better
     *
     * @param {EventTarget} element
     * @returns {boolean}
     */
    private isNativeBehaviour(element: EventTarget): boolean {
        const {Editor: {BlockManager}, config: {toolsConfig}} = this;

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
        const {Editor: {Tools, Sanitizer, BlockManager}, config: {toolsConfig}} = this;

        /** If target is native input or is not Block, use browser behaviour */
        if (this.isNativeBehaviour(event.target)) {
            return;
        }

        event.preventDefault();

        const block = this.Editor.BlockManager.getBlock(event.target);
        const toolConfig = toolsConfig[block.name];

        /** If paste is dissalowed in block do nothing */
        if (!toolConfig || toolConfig[Tools.apiSettings.IS_PASTE_DISALLOWED]) {
            return;
        }

        const htmlData  = event.clipboardData.getData('text/html'),
            plainData = event.clipboardData.getData('text/plain');

        const allowedTags = {};
        Object.entries(this.toolsTags).forEach(([tag, config]: [string, ITagSubstitute]) => {
            allowedTags[tag.toLowerCase()] = config.attributes;
        });

        /** Add all tags can be substituted to sanitizer configuration */
        const customConfig = {tags: Object.assign({}, Sanitizer.defaultConfig.tags, allowedTags)};
        const cleanData = Sanitizer.clean(htmlData, customConfig);

        let dataToInsert = [];
        if (!cleanData.trim() || cleanData.trim() === plainData.trim() || !$.isHTMLString(cleanData)) {
            dataToInsert = this.processPlain(plainData);

            if (dataToInsert.length === 1) {
                this.processSingleBlock(dataToInsert.pop());
                return;
            }
        } else {
            dataToInsert = this.processHTML(cleanData);
        }

        dataToInsert.forEach((data) => {
            BlockManager.insert(data.tool, data.data);
        });
    }

    /**
     * Process single block:
     * 1. Find patterns` matches
     * 2. Insert new block if it is not the same type as current one
     * 3. Just insert text if there is no substitutions
     *
     * @param {IBlockData} block
     */
    private processSingleBlock(block: IBlockData): void {
        const initialTool = this.config.initialBlock;
        const {BlockManager, BlockManager: {currentBlock}} = this.Editor;
        const {tool, data} = block;
        let blockToInsert = block;

        if (tool === initialTool && data.text.length < Paste.PATTERN_PROCESSING_MAX_LENGTH) {
            blockToInsert = this.processPattern(block);
        }

        if (blockToInsert.tool !== currentBlock.name) {
            BlockManager.insert(blockToInsert.tool, blockToInsert.data);
            return;
        }

        document.execCommand('insertHTML', false, blockToInsert.data.text);
    }

    /**
     * Get patterns` matches
     *
     * @param {IInitialBlockData} block
     * @returns {IBlockData}
     */
    private processPattern(block: IInitialBlockData): IBlockData {
        const {tool, data: {text}} = block;
        const match = this.toolsPatterns.find((config) => {
            const execResult = config.pattern.exec(text);

            if (!execResult) {
                return false;
            }

            return text === execResult.shift();
        });

        if (!match) {
            return block;
        }

        return match.handler(text, match.pattern);
    }

    /**
     * Split HTML string to blocks and return it as array of Block data
     *
     * @param {string} innerHTML
     * @returns {IBlockData[]}
     */
    private processHTML(innerHTML: string): IBlockData[] {
        const initialTool = this.config.initialBlock;
        const wrapper = $.make('DIV');

        wrapper.innerHTML = innerHTML;

        const nodes = this.getNodes(wrapper);

        return nodes.map((node) => {
            let data, tool = initialTool;

            switch (node.nodeType) {
                /** If node is a document fragment, use temp wrapper to get innerHTML */
                case Node.DOCUMENT_FRAGMENT_NODE:
                    const tempNode = $.make('div');
                    tempNode.appendChild(node);

                    data = {text: tempNode.innerHTML};
                    break;

                /** If node is an element, then there must be a substitution */
                case Node.ELEMENT_NODE:
                    const element = node as HTMLElement;
                    const {handler, tool: handlerTool} = this.toolsTags[element.tagName];

                    data = handler(element);
                    tool = handlerTool;
                    break;
            }

            return {tool, data};
        });
    }

    /**
     * Split plain text by new line symbols and return it as array of Block data
     *
     * @param {string} plain
     * @returns {IBlockData[]}
     */
    private processPlain(plain: string): IBlockData[] {
        if (!plain) {
            return [];
        }
        const initialTool = this.config.initialBlock;

        return plain.split('\n\n').map((text) => ({
            data: {
                text,
            },
            tool: initialTool,
        }));
    }

    /**
     * Recursively divide HTML string to two types of nodes:
     * 1. Element with tag name that have a plugin`s substitution
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

            const lastNode = nodes.pop();
            const fragment = new DocumentFragment();

            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    const element = node as HTMLElement;

                    if (!tags.includes(element.tagName)) {
                        if (!lastNode) {
                            fragment.appendChild(element);
                            return [fragment];
                        }

                        if ($.isFragment(lastNode)) {
                            lastNode.appendChild(node);
                            return [...nodes, lastNode];
                        }

                        fragment.appendChild(node);
                        return [...nodes, lastNode, fragment];
                    }

                    if (
                        tags.includes(element.tagName) &&
                        Array.from(element.children).every(({tagName}) => !tags.includes(tagName))
                    ) {
                        return lastNode ? [...nodes, lastNode, element] : [...nodes, element];
                    }
                    break;

                case Node.TEXT_NODE:
                    if (!lastNode) {
                        fragment.appendChild(node);
                        return [fragment];
                    }

                    if (!$.isFragment(lastNode)) {
                        fragment.appendChild((node));
                        return [...nodes, lastNode, fragment];
                    }

                    lastNode.appendChild(node);
                    return [...nodes, lastNode];
            }

            return [...nodes, ...Array.from(node.childNodes).reduce(reducer, [])];
        };

        return children.reduce(reducer, []);
    }
}
