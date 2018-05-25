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
                this.backSpacePressed(event);
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
         * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
         * Uses for Tools like <code> where line breaks should be handled by default behaviour.
         */
        if (toolsConfig && toolsConfig.enableLineBreaks) {

            return;

        }

        /**
         * Allow to create linebreaks by Shift+Enter
         */
        if (event.shiftKey) {

            return;

        }


        /**
         * Split the Current Block into two blocks
         */
        this.Editor.BlockManager.split();
        event.preventDefault();

    }

    /**
     * Handle backspace keypress on block
     * @param event
     */
    backSpacePressed(event) {

        let isFirstBlock    = this.Editor.BlockManager.currentBlockIndex === 0,
            canMergeBlocks  = !this.Editor.BlockManager.currentBlock.hasMedia && this.Editor.Caret.isAtStart && !isFirstBlock;

        if (!canMergeBlocks) {

            return;

        }

        // preventing browser default behaviour
        event.preventDefault();

        let targetBlock = this.Editor.BlockManager.getBlockByIndex(this.Editor.BlockManager.currentBlockIndex - 1),
            blockToMerge = this.Editor.BlockManager.currentBlock;


        if (blockToMerge.name !== targetBlock.name || !this.Editor.BlockManager.currentBlock.mergeable) {

            this.Editor.BlockManager.navigatePrevious();

        }

        this.Editor.BlockManager.mergeBlocks(targetBlock, blockToMerge)
            .then( () => {

                // decrease current block index so that to know current actual
                this.Editor.BlockManager.currentBlockIndex--;

                window.setTimeout( () => {

                    // set caret to the block without offset at the end
                    this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, 0, true);
                    this.Editor.Toolbar.close();

                }, 10);

            });

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