import Selection from '../Selection';

export default class Keyboard extends Module {

    constructor({config}) {

        super({config});

        document.body.addEventListener('keydown', event => this.keyBoardListener(event));

    }

    /**
     * handler processes special keyboard keys
     *
     * @param {KeyDown} event
     */
    keyBoardListener(event) {

        switch(event.keyCode) {

            case _.keyCodes.BACKSPACE:

                _.log('Backspace key pressed');
                break;

            case _.keyCodes.ENTER:

                _.log('Enter key pressed');
                event.preventDefault();

                this.enterPressed();
                break;

            case _.keyCodes.DOWN:

                _.log('Down key pressed');
                break;

            case _.keyCodes.RIGHT:

                _.log('Right key pressed');
                this.Editor.BlockManager.navigateNext();
                break;

            case _.keyCodes.UP:

                _.log('Up key pressed');
                break;

            case _.keyCodes.LEFT:

                _.log('left key pressed');
                this.Editor.BlockManager.navigatePrevious();
                break;

            default:

                break;

        }

    }

    /**
     * Insert new block with data below current block
     */
    enterPressed() {

        this.Editor.BlockManager.insert('text', this.Editor.BlockManager.split());

    }

}