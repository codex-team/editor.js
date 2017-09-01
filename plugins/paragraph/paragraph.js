/**
* Paragraph Plugin
* Creates DIV tag and adds content to this tag
*/

let paragraph = function () {

    const name = 'paragraph';

    let paragraphElement = null;

    /*
     * @public
     *
     * Method to render HTML block from JSON
     */
    function render(data) {

        /** Create Empty DIV */
        paragraphElement = document.createElement('div');

        paragraphElement.classList.add('ce-paragraph');

        if (data && data.text) {

            paragraphElement.innerHTML = data.text;

        }

        paragraphElement.contentEditable = true;

        return paragraphElement;


    }

    /**
     * @public
     *
     * Check output data for validity.
     * Should be defined by developer
     */
    function validate(output) {

        if (output.text === '')
            return;

        return output;

    }

    /**
     * @public
     *
     * Method to extract JSON data from HTML block
     */
    function save() {

        let wrappedText = paragraphElement.innerHTML, // codex.editor.content.wrapTextWithParagraphs(blockContent.innerHTML),
            sanitizerConfig = {
                tags : {
                    p : {},
                    a: {
                        href: true,
                        target: '_blank',
                        rel: 'nofollow'
                    },
                    i: {},
                    b: {},
                }
            };

        let data = {
            'text': wrappedText, // codex.editor.sanitizer.clean(wrappedText, sanitizerConfig),
            'format': 'html',
            'introText': '<<same>>'
        };

        return data;

    }


    return {name, render, save, validate};

};
