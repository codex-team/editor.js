export default class Keyboard extends Module {

    constructor({config}) {

        super({config});

        document.body.addEventListener('keydown', this.keyBoardListener.bind(this));

    }

    keyBoardListener(event) {

        // let currentBlock = this.Editor.blockManager.currentBlock;
        // let selection = window.getSelection();
        // let range = new Range();

        // console.log(selection.focusNode);
        // range.setStart(selection.anchorNode, selection.getRangeAt(0).startOffset);
        // range.setEnd(selection.focusNode, selection.focusNode.length);

        switch(event.keyCode) {

            case (8):
                console.log('backspace pressed');
                this.Editor.BlockManager.merge(undefined, range.extractContents());
                break;
            case (13):
                console.log('enter pressed');
                // console.log(range.extractContents());
                // let op = range.extractContents;

                // console.log(op);

                this.Editor.BlockManager.split();
                break;
            default:
                break;

        }

    }

}