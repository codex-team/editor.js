/**
 * @class Keyboard
 * @classdesc Сlass to handle the keydowns
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

/**
 * @typedef {Keyboard} Keyboard
 */
export default class Keyboard extends Module {

    /**
     * @constructor
     */
    constructor({config}) {

        super({config});

    }

    /**
     * Handler on Block for keyboard keys at keydown event
     *
     * @param {KeyboardEvent} event
     */
    blockKeydownsListener(event) {

        switch(event.keyCode) {

            case _.keyCodes.BACKSPACE:

                _.log('Backspace key pressed');
                break;

            case _.keyCodes.ENTER:

                _.log('Enter key pressed');
                this.enterPressed(event);
                break;

            case _.keyCodes.DOWN:
            case _.keyCodes.RIGHT:

                _.log('Right/Down key pressed');
                this.arrowRightAndDownPressed();
                break;

            case _.keyCodes.UP:
            case _.keyCodes.LEFT:

                _.log('Left/Up key pressed');
                this.arrowLeftAndUpPressed();
                break;

            default:

                break;

        }

    }

    /**
     * Handle pressing enter key
     *
     * @param {KeyboardEvent} event
     */
    enterPressed(event) {

        let currentBlock = this.Editor.BlockManager.currentBlock,
            toolsConfig = this.config.toolsConfig[currentBlock.name];

        /**
         * Check if configuration for enableLineBreaks property true
         */
        if (toolsConfig && toolsConfig.enableLineBreaks) {

            return;

        }

        /**
         * Check if shift key pressed synchronously with enter key
         */
        if (event.shiftKey) {

            return;

        }

        event.preventDefault();
        /**
         * Split the Current Block
         */
        this.Editor.BlockManager.split();

    }

    /**
     * Handle right and down keyboard keys
     */
    arrowRightAndDownPressed() {

        this.Editor.BlockManager.navigateNext();

    }

    /**
     * Handle left and up keyboard keys
     */
    arrowLeftAndUpPressed() {

        this.Editor.BlockManager.navigatePrevious();

    }

}