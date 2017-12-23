/**
 *
 * «Toolbar» is the node that moves up/down over current block
 *
 *  ______________________________________ Toolbar ____________________________________________
 * |                                                                                           |
 * |  ..................... Content ....................   ......... Block Actions ..........  |
 * |  .                                                .   .                                .  |
 * |  .                                                .   . [Open Settings] [Remove Block] .  |
 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]    .   .                                .  |
 * |  .                                                .   .        [Settings Panel]        .  |
 * |  ..................................................   ..................................  |
 * |                                                                                           |
 * |___________________________________________________________________________________________|
 *
 *
 * Toolbox — its an Element contains tools buttons. Can be shown by Plus Button.
 *
 *  _______________ Toolbox _______________
 * |                                       |
 * | [Header] [Image] [List] [Quote] ...   |
 * |_______________________________________|
 *
 *
 * Settings Panel — is an Element with block settings:
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 *
 *
 * @class
 * @classdesc Toolbar module
 *
 * @typedef {Toolbar} Toolbar
 * @property {Object} nodes
 * @property {Element} nodes.wrapper        - Toolbar main element
 * @property {Element} nodes.content        - Zone with Plus button and toolbox.
 * @property {Element} nodes.actions        - Zone with Block Settings and Remove Button
 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
 * @property {Element} nodes.toolbox        - Container for tools
 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
 * @property {Element} nodes.removeBlockButton - Remove Block button
 * @property {Element} nodes.settings          - Settings Panel
 * @property {Element} nodes.pluginSettings    - Plugin Settings section of Settings Panel
 * @property {Element} nodes.defaultSettings   - Default Settings section of Settings Panel
 */
export default class Toolbar extends Module {

    /**
     * @constructor
     */
    constructor(config) {

        super(config);

        this.nodes = {
            wrapper : null,
            content : null,
            actions : null,

            // Content Zone
            plusButton : null,

            // Actions Zone
            settingsToggler : null,
            removeBlockButton: null,
            settings: null,

            // Settings Zone: Plugin Settings and Default Settings
            pluginSettings: null,
            defaultSettings: null,
        };

        this.CSS = {
            toolbar: 'ce-toolbar',
            content: 'ce-toolbar__content',
            actions: 'ce-toolbar__actions',

            toolbarOpened: 'ce-toolbar--opened',

            // Content Zone
            plusButton: 'ce-toolbar__plus',

            // Actions Zone
            settingsToggler: 'ce-toolbar__settings-btn',
            removeBlockButton: 'ce-toolbar__remove-btn',

            // Settings Panel
            settings: 'ce-settings',
            defaultSettings: 'ce-settings_default',
            pluginSettings: 'ce-settings_plugin',
        };

    }

    /**
     * Makes toolbar
     */
    make() {

        this.nodes.wrapper = $.make('div', this.CSS.toolbar);

        /**
         * Make Content Zone and Actions Zone
         */
        ['content',  'actions'].forEach( el => {

            this.nodes[el] = $.make('div', this.CSS[el]);
            $.append(this.nodes.wrapper, this.nodes[el]);

        });


        /**
         * Fill Content Zone:
         *  - Plus Button
         *  - Toolbox
         */
        this.nodes.plusButton = $.make('div', this.CSS.plusButton);
        $.append(this.nodes.content, this.nodes.plusButton);
        this.nodes.plusButton.addEventListener('click', event => this.plusButtonClicked(event), false);


        /**
         * Make a Toolbox
         */
        this.Editor.Toolbox.make();

        /**
         * Fill Actions Zone:
         *  - Settings Toggler
         *  - Remove Block Button
         *  - Settings Panel
         */
        this.nodes.settingsToggler  = $.make('span', this.CSS.settingsToggler);
        this.nodes.removeBlockButton = this.makeRemoveBlockButton();

        $.append(this.nodes.actions, [this.nodes.settingsToggler, this.nodes.removeBlockButton]);

        /**
         * Make and append Settings Panel
         */
        this.makeBlockSettingsPanel();

        /**
         * Append toolbar to the Editor
         */
        $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    }

    /**
     * Panel with block settings with 2 sections:
     *
     * @return {Element}
     */
    makeBlockSettingsPanel() {

        this.nodes.settings = $.make('div', this.CSS.settings);

        this.nodes.pluginSettings = $.make('div', this.CSS.pluginSettings);
        this.nodes.defaultSettings = $.make('div', this.CSS.defaultSettings);

        $.append(this.nodes.settings, [this.nodes.pluginSettings, this.nodes.defaultSettings]);
        $.append(this.nodes.actions, this.nodes.settings);

    }

    /**
     * Makes Remove Block button, and confirmation panel
     * @return {Element} wrapper with button and panel
     */
    makeRemoveBlockButton() {

        /**
         * @todo  add confirmation panel and handlers
         * @see  {@link settings#makeRemoveBlockButton}
         */
        return $.make('span', this.CSS.removeBlockButton);

    }

    /**
     * Move Toolbar to the Current Block
     */
    move() {

        /** Close Toolbox when we move toolbar */
        this.Editor.Toolbox.close();

        let currentNode = this.Editor.BlockManager.currentNode;

        /**
         * If no one Block selected as a Current
         */
        if (!currentNode) {

            return;

        }

        /**
         * @todo Compute dynamically on prepare
         * @type {number}
         */
        const defaultToolbarHeight = 49;
        const defaultOffset = 34;

        var newYCoordinate = currentNode.offsetTop - (defaultToolbarHeight / 2) + defaultOffset;

        this.nodes.wrapper.style.transform = `translate3D(0, ${Math.floor(newYCoordinate)}px, 0)`;

        /** Close trash actions */
        // editor.toolbar.settings.hideRemoveActions();

    }

    open() {

        this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

    }

    close() {

        this.nodes.wrapper.classList.remove(this.CSS.toolbarOpened);

    }

    /**
     * Handler for Plus Button
     * @param {MouseEvent} event
     */
    plusButtonClicked(event) {

        this.Editor.Toolbox.toggle();

    }

}