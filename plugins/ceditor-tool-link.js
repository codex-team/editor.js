/**
 * Created by nostr on 29.06.16.
 */

/**
 * Link tool plugin
 */
var linkTool = {

    defaultText    : 'Insert link here ...',
    currentBlock   : null,
    currentInput   : null,
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

        linkTool.currentInput = tag;

        wrapper.appendChild(tag);

        this.currentBlock = wrapper;

        /* Bind callbacks **/

        tag.addEventListener('paste', linkTool.blockPasteCallback, false);

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
                        'linkUrl'       : 'http://yandex.ru',
                        'linkText'      : 'yandex.ru',
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

        var block = linkTool.ui.make(json);

        linkTool.currentInput.remove();

        linkTool.currentBlock.appendChild(block);

        linkTool.currentBlock = null;

    }

};

linkTool.ui = {
    
    make : function (json) {

        var wrapper = this.wrapper(),
            siteImage = this.image(json.image),
            siteTitle = this.title(json.title),
            siteDescription = this.description(json.description),
            siteLink = this.link(json.linkUrl, json.linkText);

        wrapper.appendChild(siteImage);
        wrapper.appendChild(siteTitle);
        wrapper.appendChild(siteDescription);
        wrapper.appendChild(siteLink);

        return wrapper;

    },

    wrapper : function () {

        var wrapper = document.createElement('div');

        wrapper.className += 'tool-link-panel';

        return wrapper;

    },
    
    image : function (imageSrc) {

        var imageTag = document.createElement('img');

        imageTag.classList += linkTool.elementClasses.image;

        imageTag.setAttribute('src', imageSrc);

        return imageTag;
        
    },

    link : function (linkUrl, linkText) {

        var linkTag = document.createElement('a');

        linkTag.classList += linkTool.elementClasses.link;

        linkTag.setAttribute('href', linkUrl);

        linkTag.innerText = linkText;

        return linkTag;

    },

    title : function (titleText) {

        var titleTag = document.createElement('div');

        titleTag.classList.add("tool-link-content", linkTool.elementClasses.title);

        titleTag.innerHTML = titleText;

        return titleTag;
    },

    description : function (descriptionText) {

        var descriptionTag = document.createElement('div');

        descriptionTag.classList.add("tool-link-content", linkTool.elementClasses.description);

        descriptionTag.innerHTML = descriptionText;

        return descriptionTag;
    }

}

cEditor.tools.link = {

    type           : 'link',
    iconClassname  : 'ce-icon-link',
    append         : linkTool.makeBlockToAppend(),
    appendCallback : linkTool.appendCallback
    // settings       : linkTool.makeSettings(),
    // render         : linkTool.render,
    // save           : linkTool.save

};