export default class Toolbox extends Module {

    /**
     * @constructor
     */
    constructor(config) {

        super(config);

        this.CSS = {
            toolbox: 'cdx-toolbox',
            toolboxButton: 'cdx-toolbox__button'
        };

        this.nodes = {
            toolbox: null,
            buttons: []
        };

    }

    /**
     * Makes the Toolbox
     */
    make() {

        this.nodes.toolbox = $.make('div', this.CSS.toolbox);
        $.append(this.Editor.Toolbar.nodes.content, this.nodes.toolbox);

        this.addTools();

    }

    /**
     * Iterates available tools and appends them to the Toolbox
     */
    addTools() {

        let tools = this.Editor.Tools.toolsAvailable;

        for (let toolName in tools) {

            this.addTool(toolName, tools[toolName]);

        }

    }

    /**
     * Append Tool to the Toolbox
     *
     * @param {string} toolName  - tool name
     * @param {Tool}  tool      - tool class
     */
    addTool(toolName, tool) {

        if (!tool.iconClassName && tool.displayInToolbox) {

            _.log('Toolbar icon class name is missed. Tool %o skipped', 'warn', toolName);
            return;

        }

        /**
         * @todo Add checkup for the render method
         */
        // if (typeof tool.render !== 'function') {
        //
        //     _.log('render method missed. Tool %o skipped', 'warn', tool);
        //     return;
        //
        // }

        /**
         * Skip tools that pass 'displayInToolbox=false'
         */
        if (!tool.displayInToolbox) {

            return;

        }

        let button = $.make('li', [this.CSS.toolboxButton, tool.iconClassName], {
            title: toolName
        });

        /**
         * Save tool's name in the button data-name
         */
        button.dataset.name = toolName;

        $.append(this.nodes.toolbox, button);

        this.nodes.toolbox.appendChild(button);
        this.nodes.buttons.push(button);

        /**
         * @todo add event with module Listeners
         */
        // this.Editor.Listeners.add();
        button.addEventListener('click', event => {

            this.buttonClicked(event);

        }, false);

    }

    /**
     * Toolbox button click listener
     * 1) if block is empty -> replace
     * 2) if block is not empty -> add new block below
     *
     * @param {MouseEvent} event
     */
    buttonClicked(event) {

        let toolButton = event.target,
            toolName = toolButton.dataset.name,
            tool = this.Editor.Tools.toolClasses[toolName];

        /**
         * @type {Block}
         */
        let currentBlock = this.Editor.BlockManager.currentBlock;

        /**
         * We do replace if:
         * - block is empty
         * - block is not irreplaceable
         * @type {Array}
         */
        if (!tool.irreplaceable && currentBlock.isEmpty) {

            this.Editor.BlockManager.replace(toolName);

        } else {

            this.Editor.BlockManager.insert(toolName);

        }

        /**
         * @todo set caret to the new block
         */

        // window.setTimeout(function () {

        /** Set caret to current block */
        // editor.caret.setToBlock(currentInputIndex);

        // }, 10);

        /**
         * @todo Move toolbar to the new Block
         */
        /**
         * Move toolbar when node is changed
         */
        // editor.toolbar.move();

    }

}