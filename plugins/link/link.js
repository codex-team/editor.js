/**
 * Created by nostr on 29.06.16.
 */

/**
 * Link tool plugin
 */

var link = (function(link) {

    var settings = {
        defaultText    : 'Insert link here ...',
        ENTER_KEY      : 13,
        currentBlock   : null,
        currentInput   : null,
        elementClasses : {
            link: "tool-link-link",
            image: "tool-link-image",
            title: "tool-link-title",
            description: "tool-link-description",
            loader: "tool-link-loader",
            error: "tool-link-error"
        }
    };

    var ui = {

        make : function (json) {

            var wrapper = this.wrapper(),
                siteImage = this.image(json.image, settings.elementClasses.image),
                siteTitle = this.title(json.title),
                siteDescription = this.description(json.description),
                siteLink = this.link(json.url, json.url);

            wrapper.appendChild(siteImage);
            wrapper.appendChild(siteTitle);
            wrapper.appendChild(siteLink);
            wrapper.appendChild(siteDescription);

            siteTitle.contentEditable = true;
            siteDescription.contentEditable = true;

            return wrapper;

        },

        mainBlock : function () {

            var wrapper = document.createElement('div');

            wrapper.classList.add("ceditor-tool-link");

            return wrapper;

        },

        input : function () {

            var inputTag = document.createElement('input');

            inputTag.classList.add("ceditor-tool-link-input");

            inputTag.placeholder = settings.defaultText;

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

            imageTag.classList.add(imageClass);

            imageTag.setAttribute('src', imageSrc);

            return imageTag;

        },

        link : function (linkUrl, linkText) {

            var linkTag = document.createElement('a');

            linkTag.classList.add(settings.elementClasses.link);

            linkTag.href = linkUrl;

            linkTag.target = "_blank";

            linkTag.innerText = linkText;

            return linkTag;

        },

        title : function (titleText) {

            var titleTag = document.createElement('div');

            titleTag.classList.add("tool-link-content", settings.elementClasses.title);

            titleTag.innerHTML = titleText;

            return titleTag;
        },

        description : function (descriptionText) {

            var descriptionTag = document.createElement('div');

            descriptionTag.classList.add("tool-link-content", settings.elementClasses.description);

            descriptionTag.innerHTML = descriptionText;

            return descriptionTag;
        }

    };

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    link.makeNewBlock = function (data) {

        var wrapper = ui.mainBlock(),
            tag     = ui.input();

        currentInput = tag;

        wrapper.appendChild(tag);

        wrapper.classList.add('ce-link');
        /**
         * Bind callbacks
         **/
        tag.addEventListener('paste', blockPasteCallback, false);
        tag.addEventListener('keydown', blockKeyDownCallback, false);

        return wrapper;

    };

    /**
     * Method to render HTML block from JSON
     */
    link.render = function (json) {

        var block = ui.mainBlock(),
            tag   = ui.make(json);

        block.classList.add('ce-link');
        block.appendChild(tag);

        return block;

    };

    link.validate = function (data) {

        if (data.url.trim() == '' || data.title.trim() == '' || data.description.trim() == '')
            return;

        return true;
    };

    /**
     * Method to extract JSON data from HTML block
     */
    link.save = function (blockContent){

        var linkElement = settings.elementClasses.link;

        var data = {
            url    : blockContent.querySelector("." + linkElement).href,
            shortLink   : blockContent.querySelector("." + linkElement).textContent,
            image       : blockContent.querySelector("." + linkTool.elementClasses.image).src,
            title       : blockContent.querySelector("." + linkTool.elementClasses.title).textContent,
            description : blockContent.querySelector("." + linkTool.elementClasses.description).textContent
        };

        return data;

    };

    var blockPasteCallback = function (event) {

        var clipboardData = event.clipboardData || window.clipboardData,
            pastedData    = clipboardData.getData('Text'),
            block         = event.target.parentNode;

        renderLink(pastedData, block);

        event.stopPropagation();

    };

    var blockKeyDownCallback = function (event) {

        var inputTag = event.target,
            block    = inputTag.parentNode,
            url;

        if ( block.classList.contains(settings.elementClasses.error) )
        {
            block.classList.remove(settings.elementClasses.error);
        }

        if (event.keyCode == linkTool.ENTER_KEY) {

            url = inputTag.value;

            renderLink(url, block);

            event.preventDefault();

        }

    };

    /**
     * @todo move request-url to accepted settings
     */
    var renderLink = function (url, block) {

        Promise.resolve()

            .then(function () {
                return urlify(url);
            })

            .then(function (url) {

                /* Show loader gif **/
                block.classList.add(settings.elementClasses.loader);

                return fetch('/club/linkInfo?url=' + encodeURI(url));
            })

            .then(function (response) {

                if (response.status == "200"){

                    return response.json();

                } else {

                    return Error("Invalid response status: %o", response);

                }

            })

            .then(function (json) {
                composeLinkPreview(json, block);
            })

            .catch(function(error) {

                /* Hide loader gif **/
                block.classList.remove(settings.elementClasses.loader);

                block.classList.add(settings.elementClasses.error);

                codex.core.log('Error while doing things with link paste: %o', 'error', error);
            });

    };

    var urlify = function (text) {

        var urlRegex = /(https?:\/\/\S+)/g;

        var links = text.match(urlRegex);

        if (links) {
            return links[0];
        }

        return Promise.reject(Error("Url is not matched"));

    };

    var composeLinkPreview = function (json, currentBlock) {

        if (json == {}) {
            return;
        }

        var previewBlock = ui.make(json);

        linkTool.currentInput.remove();

        currentBlock.appendChild(previewBlock);

        currentBlock.classList.remove(settings.elementClasses.loader);

    };

    return link;

})({});
