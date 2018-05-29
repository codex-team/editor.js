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
                this.backspacePressed(event);
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
     * @param {KeyboardEvent} event - keydown
     */
    backspacePressed(event) {

        const BM = this.Editor.BlockManager;

        let isFirstBlock    = BM.currentBlockIndex === 0,
            canMergeBlocks  = this.Editor.Caret.isAtStart && !isFirstBlock;

        if (!canMergeBlocks) {

            return;

        }

        // preventing browser default behaviour
        event.preventDefault();

        let targetBlock = BM.getBlockByIndex(BM.currentBlockIndex - 1),
            blockToMerge = BM.currentBlock;

        /**
         * Blocks that can be merged:
         * 1) with the same Name
         * 2) Tool has 'merge' method
         *
         * other case will handle as usual ARROW LEFT behaviour
         */
        if (blockToMerge.name !== targetBlock.name || !targetBlock.mergeable) {

            BM.navigatePrevious();

        }

        let setCaretToTheEnd = !targetBlock.isEmpty ? true : false;

        BM.mergeBlocks(targetBlock, blockToMerge)
            .then( () => {

                window.setTimeout( () => {

                    // set caret to the block without offset at the end
                    this.Editor.Caret.setToBlock(BM.currentBlock, 0, setCaretToTheEnd);
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