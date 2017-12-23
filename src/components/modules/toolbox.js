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
     * @param {Class}  tool      - tool class
     */
    addTool(toolName, tool) {

        if (!tool.iconClassName && tool.displayInToolbox) {

            _.log('Toolbar icon ClassName is missed. Tool %o skipped', 'warn', tool);
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

        /** if tools is for toolbox */
        let button = $.make('li', [this.CSS.toolboxButton, tool.iconClassName], {
            title: toolName
        });

        $.append(this.nodes.toolbox, button);

        this.nodes.toolbox.appendChild(button);
        this.nodes.buttons.push(button);

        /**
         * @todo add event with module Listeners
         */
        // this.Editor.Listeners.add();
        button.addEventListener('click', () => {

            this.buttonClicked();

        }, false);

    }

    /**
     * Toolbox button click listener
     * Replace current block with new or append new below
     *
     */
    buttonClicked() {

        // var button = this;

        // editor.toolbar.current = button.dataset.type;
        //
        // editor.toolbar.toolbox.toolClicked(event);
        // editor.toolbar.close();

        alert('Tool clicked');

    }

}