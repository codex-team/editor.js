/**
* Paragraph Plugin
* Creates DIV tag and adds content to this tag
*/

class Paragraph {

    static get name() {

        return 'paragraph';

    }

    constructor(data={}) {

        this.CSS = {
            wrapper: 'ce-paragraph'
        };

        this._data = {};

        this.data = data;

        this.element = this.render();


    }

    render() {

        let div = document.createElement('DIV');

        div.classList.add(this.CSS.wrapper);
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

        this._data.text = text;

        return this._data;

    }

    set data(data) {

        Object.assign(this._data, data);

        this.element.innerHTML = this._data.text || '';

    }

}