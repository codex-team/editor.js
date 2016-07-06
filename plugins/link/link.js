/**
* Link Tool\
* @author CodeX Team <team@ifmo.su>
* @version 0.0.1
*/

var linkTool = {

    defaultText    : 'Insert link here ...',
    ENTER_KEY      : 13,

    currentBlock   : null,
    currentInput   : null,
    elementClasses : {
        link        : "tool-link-link",
        image       : "tool-link-image",
        title       : "tool-link-title",
        description : "tool-link-description",
        loader      : "tool-link-loader",
        error       : "tool-link-error"
    },

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    makeNewBlock : function (data) {

        var wrapper = linkTool.ui.mainBlock();

        var tag = linkTool.ui.input();

        linkTool.currentInput = tag;

        wrapper.appendChild(tag);

        /* Bind callbacks **/

        tag.addEventListener('paste', linkTool.blockPasteCallback, false);

        tag.addEventListener('keydown', linkTool.blockKeyDownCallback, false);

        return wrapper;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (json) {

        var block = linkTool.ui.mainBlock();

        var tag = linkTool.ui.make(json);

        block.appendChild(tag);

        return block;

    },

    /**
     * Method to extract JSON data from HTML block
     */
    save : function (block){

        var linkElement = linkTool.elementClasses.link;

        var data = {
            fullLink    : block.querySelector("." + linkElement).href,
            shortLink   : block.querySelector("." + linkElement).textContent,
            image       : block.querySelector("." + linkTool.elementClasses.image).src,
            title       : block.querySelector("." + linkTool.elementClasses.title).textContent,
            description : block.querySelector("." + linkTool.elementClasses.description).textContent
        };

        return data;

    },

    appendCallback : function () {

        console.log('link callback is appended...');

    },

    blockPasteCallback : function (event) {

        var clipboardData = event.clipboardData || window.clipboardData,
            pastedData = clipboardData.getData('Text'),
            block = event.target.parentNode;

        linkTool.renderLink(pastedData, block);

        event.stopPropagation();

    },

    blockKeyDownCallback : function (event) {

        var inputTag = event.target,
            block = inputTag.parentNode;

        if (block.classList.contains(linkTool.elementClasses.error))
        {
            block.classList.remove(linkTool.elementClasses.error)
        }

        if (event.keyCode == linkTool.ENTER_KEY) {

            var url = inputTag.value;

            linkTool.renderLink(url, block);

            event.preventDefault();

        }

    },

    renderLink : function (url, block) {

        Promise.resolve()

            .then(function () {
                return linkTool.urlify(url)
            })

            .then(function (url) {

                /* Show loader gif **/
                block.classList.add(linkTool.elementClasses.loader);

                return fetch('/server/?url=' + encodeURI(url));
            })

            .then(function (response) {

                if (response.status == "200"){

                    return response.json();

                }
                else {

                    return Error("Invalid response status: %o", response);

                }

            })

            .then(function (json) {
                linkTool.composeLinkPreview(json, block)
            })

            .catch(function(error) {

                /* Hide loader gif **/
                block.classList.remove(linkTool.elementClasses.loader);

                block.classList.add(linkTool.elementClasses.error);

                cEditor.core.log('Error while doing things with link paste: %o', 'error', error);
            });

    },

    urlify : function (text) {

        var urlRegex = /(https?:\/\/\S+)/g;

        var links = text.match(urlRegex);

        if (links) {
            return links[0];
        }

        return Promise.reject(Error("Url is not matched"));

    },

    composeLinkPreview : function (json, currentBlock) {

        if (json == {}) {

            return;

        }

        var previewBlock = linkTool.ui.make(json);

        linkTool.currentInput.remove();

        currentBlock.appendChild(previewBlock);

        currentBlock.classList.remove(linkTool.elementClasses.loader);

    }

};

linkTool.ui = {

    make : function (json) {

        var wrapper = this.wrapper(),
            siteImage = this.image(json.image, linkTool.elementClasses.image),
            siteTitle = this.title(json.title),
            siteDescription = this.description(json.description),
            siteLink = this.link(json.linkUrl, json.linkText);

        wrapper.appendChild(siteImage);
        wrapper.appendChild(siteTitle);
        wrapper.appendChild(siteLink);
        wrapper.appendChild(siteDescription);

        return wrapper;

    },

    mainBlock : function () {

        var wrapper = document.createElement('div');

        wrapper.classList += "ceditor-tool-link";

        return wrapper

    },

    input : function () {

        var inputTag = document.createElement('input');

        inputTag.classList += "ceditor-tool-link-input";

        inputTag.placeholder = linkTool.defaultText;

        inputTag.contentEditable = false;

        return inputTag;

    },

    wrapper : function () {

        var wrapper = document.createElement('div');

        wrapper.className += 'tool-link-panel clearfix';

        return wrapper;

    },

    image : function (imageSrc, imageClass) {

        var imageTag = document.createElement('img');

        imageTag.classList += imageClass;

        imageTag.setAttribute('src', imageSrc);

        return imageTag;

    },

    link : function (linkUrl, linkText) {

        var linkTag = document.createElement('a');

        linkTag.classList += linkTool.elementClasses.link;

        linkTag.href = linkUrl;

        linkTag.target = "_blank";

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
    },

};

cEditor.tools.link = {

    type           : 'link',
    iconClassname  : 'ce-icon-link',
    make           : linkTool.makeNewBlock,
    appendCallback : linkTool.appendCallback,
    render         : linkTool.render
    // settings       : linkTool.makeSettings(),
    // save           : linkTool.save

};
