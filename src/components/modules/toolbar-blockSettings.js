/**
 * Block Settings
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 */
export default class BlockSettings extends Module {

    constructor({config}) {

        super({config});

        this.nodes = {
            wrapper: null,
            toolSettings: null,
            defaultSettings: null,
            buttonRemove: null
        };

    }

    /**
     * Block Settings CSS
     * @return {{wrapper, wrapperOpened, toolSettings, defaultSettings, button}}
     */
    static get CSS() {

        return {
            // Settings Panel
            wrapper: 'ce-settings',
            wrapperOpened: 'ce-settings--opened',
            toolSettings: 'ce-settings__plugin-zone',
            defaultSettings: 'ce-settings__default-zone',

            button: 'ce-settings__button'
        };

    }

    /**
     * Panel with block settings with 2 sections:
     *
     * @return {Element}
     */
    make() {

        this.nodes.wrapper = $.make('div', BlockSettings.CSS.wrapper);

        this.nodes.toolSettings = $.make('div', BlockSettings.CSS.toolSettings);
        this.nodes.defaultSettings = $.make('div', BlockSettings.CSS.defaultSettings);

        $.append(this.nodes.wrapper, [this.nodes.toolSettings, this.nodes.defaultSettings]);

        /**
         * Add default settings that presents for all Blocks
         */
        this.addDefaultSettings();

    }

    /**
     * Add Tool's settings
     */
    addToolSettings() {

        console.log('Block Settings: add settings for ',
            this.Editor.BlockManager.currentBlock
        );


    }

    /**
     * Add default settings
     */
    addDefaultSettings() {

        /**
         * Remove Block Button
         * --------------------------------------------
         */
        this.nodes.buttonRemove = $.make('div', BlockSettings.CSS.button, {
            textContent: 'Remove Block'
        });

        console.log('this.nodes.buttonRemove', this.nodes.buttonRemove);

        $.append(this.nodes.defaultSettings, this.nodes.buttonRemove);

        this.Editor.Listeners.on(this.nodes.buttonRemove, 'click', (event) => this.removeBlockButtonClicked(event));

    }

    /**
     * Clicks on the Remove Block Button
     */
    removeBlockButtonClicked() {

        console.log('❇️ Remove Block Button clicked');

    }

    /**
     * Is Block Settings opened or not
     * @returns {boolean}
     */
    get opened() {

        return this.nodes.wrapper.classList.contains(BlockSettings.CSS.wrapperOpened);

    }

    /**
     * Open Block Settings pane
     */
    open() {

        this.nodes.wrapper.classList.add(BlockSettings.CSS.wrapperOpened);

        /**
         * Fill Tool's settings
         */
        this.addToolSettings();

    }

    /**
     * Close Block Settings pane
     */
    close() {

        this.nodes.wrapper.classList.remove(BlockSettings.CSS.wrapperOpened);

    }

}
