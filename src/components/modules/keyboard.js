export default class Keyboard extends Module {

    constructor({config}) {

        super({config});

        document.body.addEventListener('keydown', this.keyBoardListener.bind(this));

    }

    keyBoardListener(event) {

        switch(event.keyCode) {

            case (8):
                console.log('backspace pressed');

                let selection = window.getSelection();

                if (!selection.isCollapsed || selection.anchorOffset != 0) {

                    break;

                }

                event.preventDefault();
                console.log('+');

                // this.Editor.BlockManager.Blocks.insert(this.Editor.BlockManager.currentBlockIndex - 1, 'text', this.getDataFromRange());
                break;

            case (13):
                console.log('enter pressed');

                event.preventDefault();

                this.Editor.BlockManager.insert('text', this.getDataFromRange());
                break;

            default:
                break;

        }

    }

    getDataFromRange() {

        let selection = window.getSelection();
        let range = new Range();

        let cnt = this.Editor.BlockManager.currentBlock.pluginsContent,
            last = $.getDeepestNode(cnt, true);

        range.setStart(selection.anchorNode, selection.getRangeAt(0).startOffset);
        range.setEnd(last, last.length);

        selection.removeAllRanges();
        selection.addRange(range);

        let fragm = range.extractContents();
        let div = document.createElement('div');

        div.appendChild(fragm.cloneNode(true));

        let data = {
            text: div.innerHTML,
        };

        return data;

    }

}