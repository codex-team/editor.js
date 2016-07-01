/**
 * Created by nostr on 29.06.16.
 */

/**
 * Link tool plugin
 */
var linkTool = {

    defaultText    : 'Insert link here ...',
    currentInput   : null,
    currentBlock   : null,

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    makeBlockToAppend : function (data) {

        var wrapper = document.createElement('div');

        wrapper.classList.add("ceditor-tool-link");

        var tag = document.createElement('input');

        tag.setAttribute("type", "text");

        tag.classList.add("ceditor-tool-link-input");

        tag.placeholder = linkTool.defaultText;

        tag.contentEditable = false;

        linkTool.currentInput = tag;

        wrapper.appendChild(tag);

        linkTool.currentBlock = wrapper;

        return wrapper;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (data) {

        return paragraphTool.makeBlockToAppend(data);

    },

    /**
     * Method to extract JSON data from HTML block
     */
    save : function (block){

        var data = {
            text : null
        };

        data.text = blockData.textContent;

        return data;

    },

    appendCallback : function () {

        console.log('link callback is appended...');

        linkTool.currentInput.addEventListener('paste', function (event) {
            linkTool.blockPasteCallback(event, linkTool.currentInput);
        }, false);

    },

    blockPasteCallback : function (event, block) {

        console.log("blockPasteCallback");
        clipboardData = event.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');

        Promise.resolve()

            .then(function () {
                return linkTool.urlify(pastedData)
            })

            .then(fetch('/ajax/link'))

            .then(function (response) {

                if (response.status == "200"){

                    return response.json();

                }
                else {

                    return {
                        'fullLink'      : 'http://yandex.ru',
                        'shortLink'     : 'yandex.ru',
                        'image'         : 'https://yastatic.net/morda-logo/i/apple-touch-icon/ru-76x76.png',
                        'title'         : 'Яндекс',
                        'description'   : 'Сайт, поисковик, проч.'
                    };

                }

            })

            .then(linkTool.buildBlockForLink)

            .catch(function(error) {
                cEditor.core.log('Error while doing things with link paste: %o', 'error', error);
            });

    },

    urlify              : function (text) {

        var urlRegex = /(https?:\/\/[^\s]+)/g;

        var links = text.match(urlRegex);

        if (links) {
            return links[0];
        }

        return null;

    },

    buildBlockForLink       : function (json) {

        console.log(json);

        if (json == {}) {

            return;

        }

        var wrapper = document.createElement('div');
        wrapper.classList.add("tool-link-panel");

        var siteImage = document.createElement('img');
        var siteTitle = document.createElement('div');
        var siteDescription = document.createElement('div');
        var siteUrl = document.createElement('div');

        siteImage.classList.add("tool-link-image");
        siteTitle.classList.add("tool-link-content", "tool-link-title");
        siteUrl.classList.add("tool-link-content", "tool-link-url");
        siteDescription.classList.add("tool-link-content", "tool-link-description");

        var siteLink = document.createElement('a');
        siteLink.setAttribute('href', json.fullLink);
        siteLink.classList.add("tool-link-url");
        siteLink.innerText = json.shortLink;

        siteImage.setAttribute('src', json.image);

        siteTitle.innerHTML = json.title;

        siteDescription.innerHTML = json.description;

        siteUrl.innerHTML = json.shortLink;

        wrapper.appendChild(siteImage);
        wrapper.appendChild(siteTitle);
        wrapper.appendChild(siteDescription);
        wrapper.appendChild(siteLink);

        linkTool.currentInput.remove();

        linkTool.currentBlock.appendChild(wrapper);

        linkTool.currentBlock = null;
        linkTool.currentInput = null;

    }

};

cEditor.tools.link = {

    type           : 'link',
    iconClassname  : 'ce-icon-link',
    append         : linkTool.makeBlockToAppend(),
    appendCallback : linkTool.appendCallback,
    // settings       : linkTool.makeSettings(),
    // render         : linkTool.render,
    // save           : linkTool.save

};