/**
* Paragraph Plugin
* Creates DIV tag and adds content to this tag
*/

class Paragraph {

    static get name() {

        return 'paragraph';

    }

    constructor(data={}) {

        this.CLASS = 'ce-paragraph';

        this.element = this.render();
        this.data = data;

    }

    render() {

        let div = document.createElement('DIV');

        div.classList.add(this.CLASS);
        div.contentEditable = true;

        return div;

    }

    validate(savedData) {

        if (savedData.text.trim() === '') {

            return false;

        }

        return true;

    }

    get html() {

        return this.element;

    }

    get data() {

        let text = this.element.innerHTML;

        return {
            'text': text,
        };

    }

    set data(data) {

        this.element.innerHTML = data.text || '';

    }

}