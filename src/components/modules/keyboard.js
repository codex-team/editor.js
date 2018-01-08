import Selection from '../Selection';

export default class Keyboard extends Module {

    constructor({config}) {

        super({config});

    }

    /**
     * Should be called after Editor.BlockManager preparation
     *
     * @returns {Listener}
     */
    prepare() {

        this.Editor.Listeners.on(document.body, 'keydown', event => {

            this.keyboardListener(event);

        });

    }

    /**
     * handler processes special keyboard keys
     *
     * @param {KeyDown} event
     */
    keyboardListener(event) {

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
     * Insert new block with data below current block
     *
     * @param {KeyDown} event
     */
    enterPressed(event) {

        event.preventDefault();
        this.Editor.BlockManager.split();

    }

    /**
     * Hand right and down keyboard keys
     */
    arrowRightAndDownPressed() {

        this.Editor.BlockManager.navigateNext();

    }

    /**
     * Hand left and up keyboard keys
     */
    arrowLeftAndUpPressed() {

        this.Editor.BlockManager.navigatePrevious();

    }

}