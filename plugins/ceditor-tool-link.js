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
    elementClasses : {
        link        : "tool-link-link",
        image       : "tool-link-image",
        title       : "tool-link-title",
        description : "tool-link-description"
    },

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    makeBlockToAppend : function (data) {

        var wrapper = document.createElement('div');

        wrapper.classList.add("ceditor-tool-link");

        var tag = document.createElement('input');

        tag.classList.add("ceditor-tool-link-input");

        tag.placeholder = linkTool.defaultText;

        tag.contentEditable = false;

        this.currentInput = tag;

        wrapper.appendChild(tag);

        this.currentBlock = wrapper;

        /* Bind callbacks **/

        tag.addEventListener('paste', function (event) {
            linkTool.blockPasteCallback(event, linkTool.currentInput);
        }, false);

        return wrapper;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (data) {

        return linkTool.makeBlockToAppend(data);

    },

    /**
     * Method to extract JSON data from HTML block
     */
    save : function (block){

        var data = {
            fullLink    : block.querySelector("." + linkTool.elementClasses.link).href,
            shortLink   : block.querySelector("." + linkTool.elementClasses.link).textContent,
            image       : block.querySelector("." + linkTool.elementClasses.image).src,
            title       : block.querySelector("." + linkTool.elementClasses.title).textContent,
            description : block.querySelector("." + linkTool.elementClasses.description).textContent
        };

        return data;

    },

    appendCallback : function () {

        console.log('link callback is appended...');

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

    urlify : function (text) {

        var urlRegex = /(https?:\/\/\S+)/g;

        var links = text.match(urlRegex);

        if (links) {
            return links[0];
        }

        return null;

    },

    buildBlockForLink : function (json) {

        console.log(json);

        if (json == {}) {

            return;

        }

        var wrapper = document.createElement('div'),
            siteImage = document.createElement('img'),
            siteTitle = document.createElement('div'),
            siteDescription = document.createElement('div'),
            siteLink = document.createElement('a');

        wrapper.classList.add("tool-link-panel");

        siteImage.classList.add(linkTool.elementClasses.image);
        siteImage.setAttribute('src', json.image);

        siteTitle.classList.add("tool-link-content", linkTool.elementClasses.title);
        siteTitle.innerHTML = json.title;

        siteDescription.classList.add("tool-link-content", linkTool.elementClasses.description);
        siteDescription.innerHTML = json.description;

        siteLink.setAttribute('href', json.fullLink);
        siteLink.classList.add(linkTool.elementClasses.link);
        siteLink.innerText = json.shortLink;

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