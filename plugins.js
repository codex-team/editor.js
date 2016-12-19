var tools =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @author Khaydarov Murod
	 * murod.haydarov@gmail.com
	 */
	
	var tools = function (tools) {
	
	    tools.paragraph = __webpack_require__(18);
	    tools.header = __webpack_require__(19);
	    tools.code = __webpack_require__(20);
	    tools.link = __webpack_require__(21);
	    tools.list = __webpack_require__(22);
	    tools.quote = __webpack_require__(23);
	    tools.image = __webpack_require__(24);
	    tools.paste = __webpack_require__(25);
	    tools.twitter = __webpack_require__(26);
	    tools.instagram = __webpack_require__(27);
	
	    return tools;
	}({});
	
	module.exports = tools;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* Paragraph Plugin\
	* Creates P tag and adds content to this tag
	*/
	// var tools = require('./../plugins');
	
	var paragraphTool = {
	
	    /**
	    * Make initial header block
	    * @param {object} JSON with block data
	    * @return {Element} element to append
	    */
	    make: function make(data) {
	
	        var tag = document.createElement('DIV');
	
	        tag.classList.add('ce-paragraph');
	
	        if (data && data.text) {
	            tag.innerHTML = data.text;
	        }
	
	        tag.contentEditable = true;
	
	        /**
	         * if plugin need to add placeholder
	         * tag.setAttribute('data-placeholder', 'placehoder');
	         */
	
	        /**
	         * @uses Paste tool callback.
	         * Function analyzes pasted data
	         * If pasted URL from instagram, twitter or Image
	         * it renders via Social widgets content or uploads image and uses Image tool to render
	         */
	        tag.addEventListener('paste', tools.paste.callbacks.pasted, false);
	
	        return tag;
	    },
	
	    /**
	    * Method to render HTML block from JSON
	    */
	    render: function render(data) {
	
	        return paragraphTool.make(data);
	    },
	
	    /**
	    * Method to extract JSON data from HTML block
	    */
	    save: function save(blockContent) {
	
	        var data = {
	            text: null,
	            format: "html",
	            introText: '<<same>>'
	        };
	
	        data.text = blockContent.innerHTML;
	
	        return data;
	    }
	
	};
	
	/**
	* Now plugin is ready.
	* Add it to redactor tools
	*/
	module.exports = {
	
	    type: 'paragraph',
	    iconClassname: 'ce-icon-paragraph',
	    make: paragraphTool.make,
	    appendCallback: null,
	    settings: null,
	    render: paragraphTool.render,
	    save: paragraphTool.save,
	    displayInToolbox: false,
	    enableLineBreaks: false,
	    allowedToPaste: true
	
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* Example of making plugin
	* H e a d e r
	*/
	var headerTool = {
	
	    /**
	    * Make initial header block
	    * @param {object} JSON with block data
	    * @return {Element} element to append
	    */
	    make: function make(data) {
	
	        var availableTypes = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
	            tag;
	
	        if (data && data.type && availableTypes.includes(data.type)) {
	
	            tag = document.createElement(data.type);
	
	            /**
	            * Save header type in data-attr.
	            * We need it in save method to extract type from HTML to JSON
	            */
	            tag.dataset.headerData = data.type;
	        } else {
	
	            tag = document.createElement('H2');
	            tag.dataset.headerData = 'H2';
	        }
	
	        if (data && data.text) {
	            tag.textContent = data.text;
	        }
	
	        tag.classList.add('ce-header');
	        tag.setAttribute('data-placeholder', 'Heading');
	        tag.contentEditable = true;
	
	        return tag;
	    },
	
	    /**
	    * Method to render HTML block from JSON
	    */
	    render: function render(data) {
	
	        return headerTool.make(data);
	    },
	
	    /**
	    * Method to extract JSON data from HTML block
	    */
	    save: function save(blockContent) {
	
	        var data = {
	            "heading-styles": blockContent.dataset.headerData,
	            format: "html",
	            text: null
	
	        };
	
	        data.text = blockContent.textContent;
	
	        return data;
	    },
	
	    /**
	    * Block appending callback
	    */
	    appendCallback: function appendCallback(argument) {
	
	        console.log('header appended...');
	    },
	
	    /**
	    * Settings panel content
	    *  - - - - - - - - - - - - -
	    * | настройки   H1  H2  H3  |
	    *  - - - - - - - - - - - - -
	    * @return {Element} element contains all settings
	    */
	    makeSettings: function makeSettings() {
	
	        var holder = document.createElement('DIV'),
	            types = {
	            H2: 'Заголовок раздела',
	            H3: 'Подзаголовок',
	            H4: 'Заголовок 3-его уровня'
	        },
	            selectTypeButton;
	
	        /** Add holder classname */
	        holder.className = 'ce_plugin_header--settings';
	
	        /** Now add type selectors */
	        for (var type in types) {
	
	            selectTypeButton = document.createElement('SPAN');
	
	            selectTypeButton.textContent = types[type];
	            selectTypeButton.className = 'ce_plugin_header--select_button';
	
	            this.addSelectTypeClickListener(selectTypeButton, type);
	
	            holder.appendChild(selectTypeButton);
	        }
	
	        return holder;
	    },
	
	    /**
	    * Binds click event to passed button
	    */
	    addSelectTypeClickListener: function addSelectTypeClickListener(el, type) {
	
	        el.addEventListener('click', function () {
	
	            headerTool.selectTypeClicked(type);
	        }, false);
	    },
	
	    /**
	    * Replaces old header with new type
	    * @params {string} type - new header tagName: H1—H6
	    */
	    selectTypeClicked: function selectTypeClicked(type) {
	
	        var old_header, new_header;
	
	        /** Now current header stored as a currentNode */
	        old_header = codex.content.currentNode.querySelector('[contentEditable]');
	
	        /** Making new header */
	        new_header = document.createElement(type);
	
	        new_header.innerHTML = old_header.innerHTML;
	        new_header.contentEditable = true;
	        new_header.setAttribute('data-placeholder', 'Heading');
	        new_header.classList.add('ce-header');
	
	        new_header.dataset.headerData = type;
	
	        codex.content.switchBlock(old_header, new_header, 'header');
	
	        /** Close settings after replacing */
	        codex.toolbar.settings.close();
	    }
	
	};
	
	/**
	* Now plugin is ready.
	* Add it to redactor tools
	*/
	module.exports = {
	
	    type: 'header',
	    iconClassname: 'ce-icon-header',
	    make: headerTool.make,
	    appendCallback: headerTool.appendCallback,
	    settings: headerTool.makeSettings(),
	    render: headerTool.render,
	    save: headerTool.save,
	    displayInToolbox: true,
	    enableLineBreaks: false
	
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Code Plugin\
	 * Creates code tag and adds content to this tag
	 */
	var codeTool = {
	
	    baseClass: "ce-code",
	
	    /**
	     * Make initial header block
	     * @param {object} JSON with block data
	     * @return {Element} element to append
	     */
	    make: function make(data) {
	
	        var tag = document.createElement('code');
	
	        tag.classList.add(codeTool.baseClass);
	
	        if (data && data.text) {
	            tag.innerHTML = data.text;
	        }
	
	        tag.contentEditable = true;
	
	        return tag;
	    },
	
	    /**
	     * Method to render HTML block from JSON
	     */
	    render: function render(data) {
	
	        return codeTool.make(data);
	    },
	
	    /**
	     * Method to extract JSON data from HTML block
	     */
	    save: function save(blockContent) {
	
	        var data = {
	            text: null
	        };
	
	        data.text = blockContent.innerHTML;
	
	        return data;
	    }
	
	};
	
	/**
	 * Now plugin is ready.
	 * Add it to redactor tools
	 */
	module.exports = {
	
	    type: 'code',
	    iconClassname: 'ce-icon-code',
	    make: codeTool.make,
	    appendCallback: null,
	    settings: null,
	    render: codeTool.render,
	    save: codeTool.save,
	    displayInToolbox: true,
	    enableLineBreaks: true
	
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Created by nostr on 29.06.16.
	 */
	
	/**
	 * Link tool plugin
	 */
	var linkTool = {
	
	    defaultText: 'Insert link here ...',
	    ENTER_KEY: 13,
	
	    currentBlock: null,
	    currentInput: null,
	    elementClasses: {
	        link: "tool-link-link",
	        image: "tool-link-image",
	        title: "tool-link-title",
	        description: "tool-link-description",
	        loader: "tool-link-loader",
	        error: "tool-link-error"
	    },
	
	    /**
	     * Make initial header block
	     * @param {object} JSON with block data
	     * @return {Element} element to append
	     */
	    makeNewBlock: function makeNewBlock(data) {
	
	        var wrapper = linkTool.ui.mainBlock(),
	            tag = linkTool.ui.input();
	
	        linkTool.currentInput = tag;
	
	        wrapper.appendChild(tag);
	
	        wrapper.classList.add('ce-link');
	        /**
	        * Bind callbacks
	        **/
	        tag.addEventListener('paste', linkTool.blockPasteCallback, false);
	        tag.addEventListener('keydown', linkTool.blockKeyDownCallback, false);
	
	        return wrapper;
	    },
	
	    /**
	     * Method to render HTML block from JSON
	     */
	    render: function render(json) {
	
	        var block = linkTool.ui.mainBlock(),
	            tag = linkTool.ui.make(json);
	
	        block.classList.add('ce-link');
	        block.appendChild(tag);
	
	        return block;
	    },
	
	    /**
	     * Method to extract JSON data from HTML block
	     */
	    save: function save(blockContent) {
	
	        var linkElement = linkTool.elementClasses.link;
	
	        var data = {
	            url: blockContent.querySelector("." + linkElement).href,
	            shortLink: blockContent.querySelector("." + linkElement).textContent,
	            image: blockContent.querySelector("." + linkTool.elementClasses.image).src,
	            title: blockContent.querySelector("." + linkTool.elementClasses.title).textContent,
	            description: blockContent.querySelector("." + linkTool.elementClasses.description).textContent
	        };
	
	        return data;
	    },
	
	    blockPasteCallback: function blockPasteCallback(event) {
	
	        var clipboardData = event.clipboardData || window.clipboardData,
	            pastedData = clipboardData.getData('Text'),
	            block = event.target.parentNode;
	
	        linkTool.renderLink(pastedData, block);
	
	        event.stopPropagation();
	    },
	
	    blockKeyDownCallback: function blockKeyDownCallback(event) {
	
	        var inputTag = event.target,
	            block = inputTag.parentNode,
	            url;
	
	        if (block.classList.contains(linkTool.elementClasses.error)) {
	            block.classList.remove(linkTool.elementClasses.error);
	        }
	
	        if (event.keyCode == linkTool.ENTER_KEY) {
	
	            url = inputTag.value;
	
	            linkTool.renderLink(url, block);
	
	            event.preventDefault();
	        }
	    },
	
	    /**
	    * @todo move request-url to accepted settings
	    */
	    renderLink: function renderLink(url, block) {
	
	        Promise.resolve().then(function () {
	            return linkTool.urlify(url);
	        }).then(function (url) {
	
	            /* Show loader gif **/
	            block.classList.add(linkTool.elementClasses.loader);
	
	            return fetch('/club/linkInfo?url=' + encodeURI(url));
	        }).then(function (response) {
	
	            if (response.status == "200") {
	
	                return response.json();
	            } else {
	
	                return Error("Invalid response status: %o", response);
	            }
	        }).then(function (json) {
	            console.log(json);
	            linkTool.composeLinkPreview(json, block);
	        }).catch(function (error) {
	
	            /* Hide loader gif **/
	            block.classList.remove(linkTool.elementClasses.loader);
	
	            block.classList.add(linkTool.elementClasses.error);
	
	            codex.core.log('Error while doing things with link paste: %o', 'error', error);
	        });
	    },
	
	    urlify: function urlify(text) {
	
	        var urlRegex = /(https?:\/\/\S+)/g;
	
	        var links = text.match(urlRegex);
	
	        if (links) {
	            return links[0];
	        }
	
	        return Promise.reject(Error("Url is not matched"));
	    },
	
	    composeLinkPreview: function composeLinkPreview(json, currentBlock) {
	
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
	
	    make: function make(json) {
	
	        var wrapper = this.wrapper(),
	            siteImage = this.image(json.image, linkTool.elementClasses.image),
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
	
	    mainBlock: function mainBlock() {
	
	        var wrapper = document.createElement('div');
	
	        wrapper.classList.add("ceditor-tool-link");
	
	        return wrapper;
	    },
	
	    input: function input() {
	
	        var inputTag = document.createElement('input');
	
	        inputTag.classList.add("ceditor-tool-link-input");
	
	        inputTag.placeholder = linkTool.defaultText;
	
	        inputTag.contentEditable = false;
	
	        return inputTag;
	    },
	
	    wrapper: function wrapper() {
	
	        var wrapper = document.createElement('div');
	
	        wrapper.className += 'tool-link-panel clearfix';
	
	        return wrapper;
	    },
	
	    image: function image(imageSrc, imageClass) {
	
	        var imageTag = document.createElement('img');
	
	        imageTag.classList.add(imageClass);
	
	        imageTag.setAttribute('src', imageSrc);
	
	        return imageTag;
	    },
	
	    link: function link(linkUrl, linkText) {
	
	        var linkTag = document.createElement('a');
	
	        linkTag.classList.add(linkTool.elementClasses.link);
	
	        linkTag.href = linkUrl;
	
	        linkTag.target = "_blank";
	
	        linkTag.innerText = linkText;
	
	        return linkTag;
	    },
	
	    title: function title(titleText) {
	
	        var titleTag = document.createElement('div');
	
	        titleTag.classList.add("tool-link-content", linkTool.elementClasses.title);
	
	        titleTag.innerHTML = titleText;
	
	        return titleTag;
	    },
	
	    description: function description(descriptionText) {
	
	        var descriptionTag = document.createElement('div');
	
	        descriptionTag.classList.add("tool-link-content", linkTool.elementClasses.description);
	
	        descriptionTag.innerHTML = descriptionText;
	
	        return descriptionTag;
	    }
	
	};
	
	module.exports = {
	
	    type: 'link',
	    iconClassname: 'ce-icon-link',
	    make: linkTool.makeNewBlock,
	    appendCallback: linkTool.appendCallback,
	    render: linkTool.render,
	    save: linkTool.save,
	    displayInToolbox: true,
	    enableLineBreaks: true
	
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Code Plugin\
	 * Creates code tag and adds content to this tag
	 */
	var listTool = {
	
	    baseClass: "tool-list",
	    elementClasses: {
	        li: "tool-list-li"
	    },
	
	    /**
	     * Make initial header block
	     * @param {object} JSON with block data
	     * @return {Element} element to append
	     */
	    make: function make() {
	
	        var tag = listTool.ui.make(),
	            li = listTool.ui.block("li", "tool-link-li");
	
	        var br = document.createElement("br");
	
	        li.appendChild(br);
	        tag.appendChild(li);
	
	        tag.classList.add('ce-list');
	
	        return tag;
	    },
	
	    /**
	     * Method to render HTML block from JSON
	     */
	    render: function render(data) {
	
	        var type = data.type == 'ordered' ? 'OL' : 'UL',
	            tag = listTool.ui.make(type);
	
	        tag.classList.add('ce-list');
	
	        data.items.forEach(function (element, index, array) {
	
	            var newLi = listTool.ui.block("li", listTool.elementClasses.li);
	
	            newLi.innerHTML = element;
	
	            tag.dataset.type = data.type;
	            tag.appendChild(newLi);
	        });
	
	        return tag;
	    },
	
	    /**
	     * Method to extract JSON data from HTML block
	     */
	    save: function save(blockContent) {
	
	        var data = {
	            type: null,
	            items: []
	        };
	
	        for (var index = 0; index < blockContent.childNodes.length; index++) {
	            data.items[index] = blockContent.childNodes[index].textContent;
	        }data.type = blockContent.dataset.type;
	
	        return data;
	    },
	
	    makeSettings: function makeSettings(data) {
	
	        var holder = document.createElement('DIV'),
	            selectTypeButton;
	
	        /** Add holder classname */
	        holder.className = 'ce_plugin_list--settings';
	
	        var orderedButton = listTool.ui.button("ordered"),
	            unorderedButton = listTool.ui.button("unordered");
	
	        orderedButton.addEventListener('click', function (event) {
	            listTool.changeBlockStyle(event, 'ol');
	            codex.toolbar.settings.close();
	        });
	
	        unorderedButton.addEventListener('click', function (event) {
	            listTool.changeBlockStyle(event, 'ul');
	            codex.toolbar.settings.close();
	        });
	
	        holder.appendChild(orderedButton);
	        holder.appendChild(unorderedButton);
	
	        return holder;
	    },
	
	    changeBlockStyle: function changeBlockStyle(event, blockType) {
	
	        var currentBlock = codex.content.currentNode,
	            newEditable = listTool.ui.make(blockType),
	            oldEditable = currentBlock.querySelector("[contenteditable]");
	
	        newEditable.dataset.type = blockType;
	        newEditable.innerHTML = oldEditable.innerHTML;
	        newEditable.classList.add('ce-list');
	
	        codex.content.switchBlock(currentBlock, newEditable, 'list');
	    }
	
	};
	
	listTool.ui = {
	
	    make: function make(blockType) {
	
	        var wrapper = this.block(blockType || 'UL', listTool.baseClass);
	
	        wrapper.dataset.type = 'ul';
	        wrapper.contentEditable = true;
	
	        return wrapper;
	    },
	
	    block: function block(blockType, blockClass) {
	
	        var block = document.createElement(blockType);
	
	        if (blockClass) block.classList.add(blockClass);
	
	        return block;
	    },
	
	    button: function button(buttonType) {
	
	        var types = {
	            unordered: '<i class="ce-icon-list-bullet"></i>Обычный список',
	            ordered: '<i class="ce-icon-list-numbered"></i>Нумерованный список'
	        },
	            button = document.createElement('SPAN');
	
	        button.innerHTML = types[buttonType];
	
	        button.className = 'ce_plugin_list--select_button';
	
	        return button;
	    }
	};
	
	/**
	 * Now plugin is ready.
	 * Add it to redactor tools
	 */
	module.exports = {
	
	    type: 'list',
	    iconClassname: 'ce-icon-list-bullet',
	    make: listTool.make,
	    appendCallback: null,
	    settings: listTool.makeSettings(),
	    render: listTool.render,
	    save: listTool.save,
	    displayInToolbox: true,
	    enableLineBreaks: true
	
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* Codex Team
	* @author Khaydarov Murod
	*/
	
	var quoteTools = {
	
	    /** Default path to redactors images */
	    path: '/upload/redactor_images/',
	
	    /**
	    * Default quote style
	    */
	    defaultStyle: 'withPhoto',
	
	    /**
	    * Make Quote from JSON datasets
	    */
	    makeBlockToAppend: function makeBlockToAppend(data) {
	
	        var tag;
	
	        if (data && data.size) {
	
	            data.style = 'withPhoto';
	
	            switch (data.style) {
	                case 'simple':
	                    tag = quoteTools.makeSimpleQuote(data);
	                    break;
	                case 'withCaption':
	                    tag = quoteTools.makeQuoteWithCaption(data);
	                    break;
	                case 'withPhoto':
	                    tag = quoteTools.makeQuoteWithPhoto(data);
	                    break;
	            }
	        } else {
	
	            var settings = {
	                style: 'withPhoto',
	                text: '',
	                author: '',
	                job: '',
	                photo: ''
	            };
	
	            tag = quoteTools.makeQuoteWithPhoto(settings);
	        }
	
	        return tag;
	    },
	
	    render: function render(data) {
	        return quoteTools.makeBlockToAppend(data);
	    },
	
	    save: function save(blockContent) {
	
	        /**
	        * Extracts JSON quote data from HTML block
	        * @param {Text} text, {Text} author, {Object} photo
	        */
	        var parsedblock = quoteTools.parseBlockQuote(blockContent);
	        data = {
	            style: parsedblock.style,
	            text: parsedblock.text,
	            author: parsedblock.author,
	            job: parsedblock.job,
	            photo: parsedblock.photo,
	            "format": "html",
	            "cite": parsedblock.author,
	            "size": "small"
	        };
	
	        return data;
	    },
	
	    makeSettings: function makeSettings(data) {
	
	        var holder = document.createElement('DIV'),
	            types = {
	            simple: 'Простая цитата',
	            withCaption: 'Цитата с подписью',
	            withPhoto: 'Цитата с фото и ФИО'
	        },
	            selectTypeButton;
	
	        /** Add holder classname */
	        holder.className = quoteTools.styles.settings.holder;
	
	        /** Now add type selectors */
	        for (var type in types) {
	
	            selectTypeButton = document.createElement('SPAN');
	
	            selectTypeButton.textContent = types[type];
	            selectTypeButton.className = quoteTools.styles.settings.buttons;
	
	            selectTypeButton.dataset.style = type;
	
	            if (type == quoteTools.defaultStyle) {
	                selectTypeButton.classList.add(quoteTools.styles.settings.selectedType);
	            }
	
	            // var quoteStyle = quoteTools.selectTypeQuoteStyle(type);
	
	            selectTypeButton.addEventListener('click', quoteTools.changeStyleClicked, false);
	            // quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);
	
	            holder.appendChild(selectTypeButton);
	        }
	
	        return holder;
	    },
	
	    changeStyleClicked: function changeStyleClicked() {
	
	        var changeStyleButton = this,
	            quote = codex.content.currentNode.querySelector('.' + quoteTools.styles.ce_quote),
	            newStyle = changeStyleButton.dataset.style,
	            styleSelectors = this.parentNode.childNodes;
	
	        quote.dataset.quoteStyle = newStyle;
	
	        /**
	        * Mark selected style button
	        */
	        for (var i = styleSelectors.length - 1; i >= 0; i--) {
	            styleSelectors[i].classList.remove(quoteTools.styles.settings.selectedType);
	        }
	
	        this.classList.add(quoteTools.styles.settings.selectedType);
	    },
	
	    /**
	    * @deprecated
	    */
	    selectTypeQuoteStyle: function selectTypeQuoteStyle(type) {
	
	        /**
	        *  Choose Quote style to replace
	        */
	        switch (type) {
	            case 'simple':
	                quoteStyleFunction = quoteTools.makeSimpleQuote;
	                break;
	            case 'withCaption':
	                quoteStyleFunction = quoteTools.makeQuoteWithCaption;
	                break;
	            case 'withPhoto':
	                quoteStyleFunction = quoteTools.makeQuoteWithPhoto;
	                break;
	        }
	
	        return quoteStyleFunction;
	    },
	
	    /**
	    * @deprecated
	    */
	    addSelectTypeClickListener: function addSelectTypeClickListener(el, quoteStyle) {
	
	        el.addEventListener('click', function () {
	
	            /**
	            * Parsing currentNode to JSON.
	            */
	            var parsedOldQuote = quoteTools.parseBlockQuote(),
	                newStyledQuote = quoteStyle(parsedOldQuote);
	
	            var wrapper = codex.content.composeNewBlock(newStyledQuote, 'quote');
	            wrapper.appendChild(newStyledQuote);
	
	            codex.content.switchBlock(codex.content.currentNode, newStyledQuote, 'quote');
	
	            /** Close settings after replacing */
	            codex.toolbar.settings.close();
	        }, false);
	    },
	
	    /**
	    * @deprecated
	    */
	    makeSimpleQuote: function makeSimpleQuote(data) {
	
	        var wrapper = quoteTools.ui.makeBlock('BLOCKQUOTE', [quoteTools.styles.simple.text, quoteTools.styles.quoteText]);
	
	        wrapper.innerHTML = data.text || '';
	
	        wrapper.dataset.quoteStyle = 'simple';
	        wrapper.classList.add(quoteTools.styles.ce_quote);
	        wrapper.contentEditable = 'true';
	
	        return wrapper;
	    },
	
	    /**
	    * @deprecated
	    */
	    makeQuoteWithCaption: function makeQuoteWithCaption(data) {
	
	        var wrapper = quoteTools.ui.blockquote(),
	            text = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withCaption.blockquote, quoteTools.styles.quoteText]),
	            author = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withCaption.author, quoteTools.styles.quoteAuthor]);
	
	        /* make text block ontentEditable */
	        text.contentEditable = 'true';
	
	        text.innerHTML = data.text;
	
	        /* make Author contentEditable */
	        author.contentEditable = 'true';
	
	        author.textContent = data.cite;
	
	        /* Appending created components */
	        wrapper.dataset.quoteStyle = 'withCaption';
	        wrapper.classList.add(quoteTools.styles.ce_quote);
	
	        wrapper.appendChild(text);
	        wrapper.appendChild(author);
	
	        return wrapper;
	    },
	
	    makeQuoteWithPhoto: function makeQuoteWithPhoto(data) {
	
	        var wrapper = quoteTools.ui.blockquote(),
	            photo = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.photo]),
	            author = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.author, quoteTools.styles.quoteAuthor]),
	            job = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.job, quoteTools.styles.authorsJob]),
	            quote = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.quote, quoteTools.styles.quoteText]);
	
	        /* Default Image src */
	        if (!data.photo) {
	
	            var icon = quoteTools.ui.makeBlock('SPAN', ['ce-icon-picture']);
	            photo.appendChild(icon);
	        } else {
	
	            var authorsPhoto = quoteTools.ui.img(quoteTools.styles.authorsPhoto);
	            authorsPhoto.src = data.photo;
	
	            photo.classList.add(quoteTools.styles.authorsPhotoWrapper);
	            photo.appendChild(authorsPhoto);
	        }
	
	        photo.addEventListener('click', quoteTools.fileUploadClicked, false);
	
	        /* make author block contentEditable */
	        author.contentEditable = 'true';
	        author.textContent = data.cite;
	
	        /*  Author's position and job */
	        job.contentEditable = 'true';
	        job.textContent = data.job;
	
	        var authorsWrapper = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.authorHolder]);
	        authorsWrapper.appendChild(author);
	        authorsWrapper.appendChild(job);
	
	        /* make quote text contentEditable */
	        quote.contentEditable = 'true';
	        quote.innerHTML = data.text;
	
	        wrapper.classList.add(quoteTools.styles.ce_quote);
	        wrapper.classList.add(quoteTools.styles.withPhoto.wrapper);
	        wrapper.dataset.quoteStyle = 'withPhoto';
	
	        wrapper.appendChild(quote);
	        wrapper.appendChild(photo);
	        wrapper.appendChild(authorsWrapper);
	
	        return wrapper;
	    },
	
	    parseBlockQuote: function parseBlockQuote(block) {
	
	        var currentNode = block || codex.content.currentNode,
	            photo = currentNode.getElementsByTagName('img')[0],
	            author = currentNode.querySelector('.' + quoteTools.styles.quoteAuthor),
	            job = currentNode.querySelector('.' + quoteTools.styles.authorsJob),
	            quote;
	
	        /** Simple quote text placed in Blockquote tag*/
	        if (currentNode.dataset.quoteStyle == 'simple') quote = currentNode.innerHTML;else quote = currentNode.querySelector('.' + quoteTools.styles.quoteText).innerHTML;
	
	        if (job) job = job.textContent;
	
	        if (author) author = author.textContent;
	
	        if (photo) photo = photo.src;
	
	        var data = {
	            style: currentNode.dataset.quoteStyle,
	            text: quote,
	            author: author,
	            job: job,
	            photo: photo
	        };
	
	        return data;
	    },
	
	    fileUploadClicked: function fileUploadClicked() {
	
	        var success = quoteTools.photoUploadingCallbacks.success,
	            error = quoteTools.photoUploadingCallbacks.error;
	
	        codex.transport.selectAndUpload({
	            success: success,
	            error: error
	        });
	    }
	
	};
	
	quoteTools.styles = {
	
	    ce_quote: 'ce-quote',
	    quoteText: 'ce_quote--text',
	    quoteAuthor: 'ce_quote--author',
	    authorsJob: 'ce_quote--job',
	    authorsPhoto: 'authorsPhoto',
	    authorsPhotoWrapper: 'authorsPhoto-wrapper',
	
	    simple: {
	        text: 'quoteStyle-simple--text'
	    },
	
	    withCaption: {
	        blockquote: 'quoteStyle-withCaption--blockquote',
	        author: 'quoteStyle-withCaption--author'
	    },
	
	    withPhoto: {
	        photo: 'quoteStyle-withPhoto--photo',
	        author: 'quoteStyle-withPhoto--author',
	        job: 'quoteStyle-withPhoto--job',
	        quote: 'quoteStyle-withPhoto--quote',
	        wrapper: 'quoteStyle-withPhoto--wrapper',
	        authorHolder: 'quoteStyle-withPhoto--authorWrapper'
	    },
	
	    settings: {
	        holder: 'ce_plugin_quote--settings',
	        caption: 'ce_plugin_quote--caption',
	        buttons: 'ce_plugin_quote--select_button',
	        selectedType: 'ce-quote-settings--selected'
	    }
	};
	
	quoteTools.ui = {
	
	    wrapper: function wrapper($classList) {
	
	        var el = document.createElement('DIV');
	
	        el.classList.add($classList);
	
	        return el;
	    },
	
	    blockquote: function blockquote() {
	
	        var el = document.createElement('BLOCKQUOTE');
	
	        return el;
	    },
	
	    img: function img(attribute) {
	        var imageTag = document.createElement('IMG');
	        imageTag.classList.add(attribute);
	
	        return imageTag;
	    },
	
	    makeBlock: function makeBlock(tag, classList) {
	
	        var el = document.createElement(tag);
	
	        if (classList) {
	
	            for (var i = 0; i < classList.length; i++) {
	                el.className += ' ' + classList[i];
	            }
	        }
	        return el;
	    }
	
	};
	
	quoteTools.photoUploadingCallbacks = {
	
	    /**
	    * Success callbacks for uploaded photo.
	    * Replace upload icon with uploaded photo
	    */
	    success: function success(result) {
	
	        var parsed = JSON.parse(result),
	            filename = parsed.filename,
	            uploadImageWrapper = codex.content.currentNode.querySelector('.' + quoteTools.styles.withPhoto.photo),
	            authorsPhoto = quoteTools.ui.img(quoteTools.styles.authorsPhoto);
	
	        authorsPhoto.src = quoteTools.path + 'b_' + filename;
	
	        /** Remove icon from image wrapper */
	        uploadImageWrapper.innerHTML = '';
	
	        /** Appending uploaded image */
	        uploadImageWrapper.classList.add(quoteTools.styles.authorsPhotoWrapper);
	        uploadImageWrapper.appendChild(authorsPhoto);
	    },
	
	    /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
	    error: function error(result) {
	
	        console.log('Can\'t upload an image');
	        codex.notifications.errorThrown();
	    }
	
	};
	
	module.exports = {
	
	    type: 'quote',
	    iconClassname: 'ce-icon-quote',
	    make: quoteTools.makeBlockToAppend,
	    appendCallback: null,
	    settings: quoteTools.makeSettings(),
	    render: quoteTools.render,
	    save: quoteTools.save,
	    displayInToolbox: true,
	    enableLineBreaks: true,
	    allowedToPaste: true
	
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* Image plugin for codex-editor
	* @author CodeX Team <team@ifmo.su>
	*
	* @version 1.1.3
	*/
	var ceImage = {
	
	    elementClasses: {
	
	        ce_image: 'ce-image',
	        loading: 'ce-plugin-image__loader',
	        blockStretched: 'ce-block--stretched',
	        uploadedImage: {
	            centered: 'ce-plugin-image__uploaded--centered',
	            stretched: 'ce-plugin-image__uploaded--stretched'
	        },
	        imageCaption: 'ce-plugin-image__caption',
	        imageWrapper: 'ce-plugin-image__wrapper',
	        formHolder: 'ce-plugin-image__holder',
	        uploadButton: 'ce-plugin-image__button'
	
	    },
	
	    holder: null,
	
	    /** Default path to redactors images */
	    path: '/upload/redactor_images/',
	
	    make: function make(data) {
	
	        var holder;
	
	        if (data) {
	
	            if (data.isStretch !== 'true') {
	                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.centered, 'false');
	            } else {
	                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.stretched, 'true');
	            }
	
	            return holder;
	        } else {
	
	            holder = ceImage.ui.makeForm();
	
	            return holder;
	        }
	    },
	
	    /**
	     * this tool works when tool is clicked in toolbox
	     */
	    appendCallback: function appendCallback(event) {
	
	        /** Upload image and call success callback*/
	        ceImage.uploadButtonClicked(event);
	    },
	
	    /**
	    * Settings panel content
	    * @return {Element} element contains all settings
	    */
	    makeSettings: function makeSettings() {
	
	        var holder = document.createElement('DIV'),
	            types = {
	            centered: 'По центру',
	            stretched: 'На всю ширину'
	        },
	            selectTypeButton;
	
	        /** Add holder classname */
	        holder.className = 'ce_plugin_image--settings';
	
	        /** Now add type selectors */
	        for (var type in types) {
	
	            selectTypeButton = document.createElement('SPAN');
	
	            selectTypeButton.textContent = types[type];
	            selectTypeButton.className = 'ce_plugin_image--select_button';
	
	            this.addSelectTypeClickListener(selectTypeButton, type);
	
	            holder.appendChild(selectTypeButton);
	        }
	
	        return holder;
	    },
	
	    addSelectTypeClickListener: function addSelectTypeClickListener(el, type) {
	
	        el.addEventListener('click', function () {
	
	            ceImage.selectTypeClicked(type);
	        }, false);
	    },
	
	    selectTypeClicked: function selectTypeClicked(type) {
	
	        var current = codex.content.currentNode,
	            blockContent = current.childNodes[0],
	            image = ceImage.ui.getImage(current),
	            wrapper = current.querySelector('.' + ceImage.elementClasses.imageWrapper);
	
	        /** Clear classList */
	        current.className = '';
	        image.className = '';
	
	        /** Add important first-level class ce_block */
	        current.classList.add(codex.ui.className.BLOCK_CLASSNAME);
	
	        if (type === 'stretched') {
	
	            image.classList.add(ceImage.elementClasses.uploadedImage.stretched);
	
	            blockContent.classList.add(ceImage.elementClasses.blockStretched);
	
	            /** Setting dataset for saver */
	            wrapper.dataset.stretched = true;
	        } else if (type === 'centered') {
	
	            image.classList.add(ceImage.elementClasses.uploadedImage.centered);
	
	            blockContent.classList.remove(ceImage.elementClasses.blockStretched);
	
	            /** Setting dataset for saver */
	            wrapper.dataset.stretched = false;
	        }
	    },
	
	    render: function render(data) {
	
	        return this.make(data);
	    },
	
	    save: function save(block) {
	
	        var content = block,
	            image = ceImage.ui.getImage(content),
	            caption = content.querySelector('.' + ceImage.elementClasses.imageCaption);
	
	        var data = {
	            background: false,
	            border: false,
	            isStretch: content.dataset.stretched,
	            file: {
	                url: image.src,
	                bigUrl: null,
	                width: image.width,
	                height: image.height,
	                additionalData: null
	            },
	            caption: caption.textContent,
	            cover: null
	        };
	
	        return data;
	    },
	
	    uploadButtonClicked: function uploadButtonClicked(event) {
	
	        var beforeSend = ceImage.photoUploadingCallbacks.beforeSend,
	            success = ceImage.photoUploadingCallbacks.success,
	            error = ceImage.photoUploadingCallbacks.error;
	
	        /** Define callbacks */
	        codex.transport.selectAndUpload({
	            beforeSend: beforeSend,
	            success: success,
	            error: error
	        });
	    }
	
	};
	
	ceImage.ui = {
	
	    holder: function holder() {
	
	        var element = document.createElement('DIV');
	
	        element.classList.add(ceImage.elementClasses.formHolder);
	        element.classList.add(ceImage.elementClasses.ce_image);
	
	        return element;
	    },
	
	    uploadButton: function uploadButton() {
	
	        var button = document.createElement('SPAN');
	
	        button.classList.add(ceImage.elementClasses.uploadButton);
	
	        button.innerHTML = '<i class="ce-icon-picture"> </i>';
	        button.innerHTML += 'Загрузить фотографию';
	
	        return button;
	    },
	
	    /**
	    * @param {string} source - file path
	    * @param {string} style - css class
	    * @return {object} image - document IMG tag
	    */
	    image: function image(source, style) {
	
	        var image = document.createElement('IMG');
	
	        image.classList.add(style);
	
	        image.src = source;
	
	        return image;
	    },
	
	    wrapper: function wrapper() {
	
	        var div = document.createElement('div');
	
	        div.classList.add(ceImage.elementClasses.imageWrapper);
	
	        return div;
	    },
	
	    caption: function caption() {
	
	        var div = document.createElement('div');
	
	        div.classList.add(ceImage.elementClasses.imageCaption);
	        div.contentEditable = true;
	
	        return div;
	    },
	    /**
	    * Draws form for image upload
	    */
	    makeForm: function makeForm() {
	
	        var holder = ceImage.ui.holder(),
	            uploadButton = ceImage.ui.uploadButton();
	
	        holder.appendChild(uploadButton);
	
	        uploadButton.addEventListener('click', ceImage.uploadButtonClicked, false);
	
	        ceImage.holder = holder;
	
	        return holder;
	    },
	
	    /**
	    * wraps image and caption
	    * @param {object} data - image information
	    * @param {string} imageTypeClass - plugin's style
	    * @param {boolean} stretched - stretched or not
	    * @return wrapped block with image and caption
	    */
	    makeImage: function makeImage(data, imageTypeClass, stretched) {
	
	        var file = data.file.url,
	            text = data.caption,
	            type = data.type,
	            image = ceImage.ui.image(file, imageTypeClass),
	            caption = ceImage.ui.caption(),
	            wrapper = ceImage.ui.wrapper();
	
	        caption.textContent = text;
	
	        wrapper.dataset.stretched = stretched;
	        /** Appeding to the wrapper */
	        wrapper.appendChild(image);
	        wrapper.appendChild(caption);
	
	        return wrapper;
	    },
	
	    /**
	    * @param {HTML} data - Rendered block with image
	    */
	    getImage: function getImage(data) {
	
	        var image = data.querySelector('.' + ceImage.elementClasses.uploadedImage.centered) || data.querySelector('.' + ceImage.elementClasses.uploadedImage.stretched);
	
	        return image;
	    },
	
	    /**
	    * wraps image and caption
	    * @deprecated
	    * @param {object} data - image information
	    * @return wrapped block with image and caption
	    */
	    centeredImage: function centeredImage(data) {
	
	        var file = data.file.url,
	            text = data.caption,
	            type = data.type,
	            image = ceImage.ui.image(file, ceImage.elementClasses.uploadedImage.centered),
	            caption = ceImage.ui.caption(),
	            wrapper = ceImage.ui.wrapper();
	
	        caption.textContent = text;
	
	        wrapper.dataset.stretched = 'false';
	
	        /** Appeding to the wrapper */
	        wrapper.appendChild(image);
	        wrapper.appendChild(caption);
	
	        return wrapper;
	    },
	
	    /**
	    * wraps image and caption
	    * @deprecated
	    * @param {object} data - image information
	    * @return stretched image
	    */
	    stretchedImage: function stretchedImage(data) {
	
	        var file = data.file.url,
	            text = data.caption,
	            type = data.type,
	            image = ceImage.ui.image(file, ceImage.elementClasses.uploadedImage.stretched),
	            caption = ceImage.ui.caption(),
	            wrapper = ceImage.ui.wrapper();
	
	        caption.textContent = text;
	
	        wrapper.dataset.stretched = 'true';
	        /** Appeding to the wrapper */
	        wrapper.appendChild(image);
	        wrapper.appendChild(caption);
	
	        return wrapper;
	    }
	
	};
	
	ceImage.photoUploadingCallbacks = {
	
	    /** Before sending ajax request */
	    beforeSend: function beforeSend() {
	        ceImage.holder.classList.add(ceImage.elementClasses.loading);
	    },
	
	    /** Photo was uploaded successfully */
	    success: function success(result) {
	
	        var parsed = JSON.parse(result),
	            data,
	            currentBlock = codex.content.currentNode,
	            image;
	
	        /**
	        * Preparing {Object} data to draw an image
	        * @uses ceImage.make method
	        */
	        data = {
	            background: false,
	            border: false,
	            isStretch: false,
	            file: {
	                url: ceImage.path + 'o_' + parsed.filename,
	                bigUrl: null,
	                width: null,
	                height: null,
	                additionalData: null
	            },
	            caption: '',
	            cover: null
	        };
	
	        image = ceImage.make(data);
	
	        /**
	         * If current block is empty, we can replace it to uploaded image
	         * Or insert new block
	         */
	        codex.content.switchBlock(ceImage.holder, image, 'image');
	    },
	
	    /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
	    error: function error(result) {
	        console.log('Choosen file is not an image or image is corrupted');
	        codex.notifications.errorThrown();
	    }
	
	};
	
	/**
	* Add plugin it to redactor tools
	*/
	module.exports = {
	
	    type: 'image',
	    iconClassname: 'ce-icon-picture',
	    make: ceImage.make,
	    appendCallback: ceImage.appendCallback,
	    settings: ceImage.makeSettings(),
	    render: ceImage.render,
	    save: ceImage.save,
	    isStretched: true,
	    displayInToolbox: true,
	    enableLineBreaks: false
	
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Paste plugin.
	 *
	 * Listens on paste event and pastes content from:
	 *  - Instagram
	 *  - Twitter
	 *  - VK
	 *  - Facebook
	 *  - Image
	 *  - External Link
	 *
	 */
	
	/**
	 * @protected
	 *
	 * Main tool settings.
	 */
	var pasteTool = {};
	
	/**
	 * Make elements to insert or switch
	 *
	 * @uses Core codex.draw module
	 */
	pasteTool.ui = {
	
	    /**
	     * Upload image by URL
	     *
	     * @uses codex Image tool
	     * @param filename
	     * @returns {Element}
	     */
	    uploadedImage: function uploadedImage(filename) {
	
	        var data = {
	            background: false,
	            border: false,
	            isStretch: false,
	            file: {
	                url: "upload/redactor_images/" + filename,
	                bigUrl: "upload/redactor_images/" + filename,
	                width: null,
	                height: null,
	                additionalData: "null"
	            },
	            caption: '',
	            cover: null
	        };
	
	        /** Using Image plugin make method */
	        var image = codex.tools.image.make(data);
	
	        return image;
	    }
	
	};
	
	/**
	 *
	 * Callbacks
	 */
	pasteTool.callbacks = {
	
	    /**
	     * Saves data
	     * @param event
	     */
	    pasted: function pasted(event) {
	
	        var clipBoardData = event.clipboardData || window.clipboardData,
	            content = clipBoardData.getData('Text');
	
	        pasteTool.callbacks.analize(content);
	    },
	
	    /**
	     * Analizes pated string and calls necessary method
	     */
	    analize: function analize(string) {
	
	        var regexTemplates = {
	            image: /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
	            instagram: new RegExp("http?.+instagram.com\/p?."),
	            twitter: new RegExp("http?.+twitter.com?.+\/"),
	            facebook: /https?.+facebook.+\/\d+\?/,
	            vk: /https?.+vk?.com\/feed\?w=wall\d+_\d+/
	        },
	            image = regexTemplates.image.test(string),
	            instagram = regexTemplates.instagram.exec(string),
	            twitter = regexTemplates.twitter.exec(string),
	            facebook = regexTemplates.facebook.test(string),
	            vk = regexTemplates.vk.test(string);
	
	        if (image) {
	
	            pasteTool.callbacks.uploadImage(string);
	        } else if (instagram) {
	
	            pasteTool.callbacks.instagramMedia(instagram);
	        } else if (twitter) {
	
	            pasteTool.callbacks.twitterMedia(twitter);
	        } else if (facebook) {
	
	            pasteTool.callbacks.facebookMedia(string);
	        } else if (vk) {
	
	            pasteTool.callbacks.vkMedia(string);
	        }
	    },
	
	    /**
	     * Direct upload
	     * @param url
	     */
	    uploadImage: function uploadImage(path) {
	
	        var ajaxUrl = location.protocol + '//' + location.hostname + ':32769',
	            file,
	            image,
	            current = codex.content.currentNode,
	            beforeSend,
	            success_callback;
	
	        /** When image is uploaded to redactors folder */
	        success_callback = function success_callback(data) {
	
	            console.log(data);
	            return;
	            var file = JSON.parse(data);
	            image = pasteTool.ui.uploadedImage(file.filename);
	            codex.content.switchBlock(current, image, 'image');
	        };
	
	        /** Before sending XMLHTTP request */
	        beforeSend = function beforeSend() {
	            var content = current.querySelector('.ce-block__content');
	            content.classList.add('ce-plugin-image__loader');
	        };
	
	        /** Preparing data for XMLHTTP */
	        var data = {
	            url: '/club/fetchImage',
	            type: "POST",
	            data: {
	                url: path
	            },
	            beforeSend: beforeSend,
	            success: success_callback
	        };
	
	        codex.core.ajax(data);
	    },
	
	    /**
	     * callback for instagram url's
	     * Using instagram Embed Widgete to render
	     * @uses Instagram tool
	     * @param url
	     */
	    instagramMedia: function instagramMedia(url) {
	
	        var fullUrl = url.input,
	            data;
	
	        data = {
	            instagram_url: fullUrl
	        };
	
	        codex.tools.instagram.make(data, true);
	    },
	
	    /**
	     * callback for tweets
	     * Using Twittter Widget to render
	     * @uses Twitter tool
	     * @param url
	     */
	    twitterMedia: function twitterMedia(url) {
	
	        var fullUrl = url.input,
	            tweetId,
	            arr,
	            data;
	
	        arr = fullUrl.split('/');
	        tweetId = arr.pop();
	
	        /** Example */
	        data = {
	            media: true,
	            conversation: false,
	            user: {
	                profile_image_url: "http:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
	                profile_image_url_https: "https:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
	                screen_name: "Niketas",
	                name: "Никита Лихачёв"
	            },
	            id: tweetId,
	            text: "ВНИМАНИЕ ЧИТАТЬ ВСЕМ НЕ ДАЙ БОГ ПРОПУСТИТЕ НУ ИЛИ ХОТЯ БЫ КЛИКНИ И ПОДОЖДИ 15 СЕКУНД https:\/\/t.co\/iWyOHf4xr2",
	            created_at: "Tue Jun 28 14:09:12 +0000 2016",
	            status_url: "https:\/\/twitter.com\/Niketas\/status\/747793978511101953",
	            caption: "Caption"
	        };
	
	        codex.tools.twitter.make(data);
	    }
	
	};
	
	module.exports = {
	
	    type: 'paste',
	    iconClassname: '',
	    prepare: pasteTool.prepare,
	    make: pasteTool.make,
	    appendCallback: null,
	    settings: null,
	    render: null,
	    save: pasteTool.save,
	    callbacks: pasteTool.callbacks,
	    displayInToolbox: false,
	    enableLineBreaks: false,
	    allowedToPaste: false
	
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Twitter plugin
	 * @version 1.0.0
	 */
	
	var twitterTool = {
	
	    /**
	     * Prepare twitter scripts
	     */
	    prepare: function prepare() {
	
	        var script = "//platform.twitter.com/widgets.js";
	
	        /**
	         * Load script
	         */
	        codex.core.importScript(script, 'twitterAPI');
	    },
	
	    make: function make(data) {
	
	        if (!data.id) return;
	
	        twitterTool.content.twitter(data.id);
	    },
	
	    save: function save(blockContent) {
	
	        var data;
	
	        data = {
	            media: true,
	            conversation: false,
	            user: {
	                profile_image_url: "http:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
	                profile_image_url_https: "https:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
	                screen_name: "Niketas",
	                name: "Никита Лихачёв"
	            },
	            id: blockContent.dataset.tweetId,
	            text: "ВНИМАНИЕ ЧИТАТЬ ВСЕМ НЕ ДАЙ БОГ ПРОПУСТИТЕ НУ ИЛИ ХОТЯ БЫ КЛИКНИ И ПОДОЖДИ 15 СЕКУНД https:\/\/t.co\/iWyOHf4xr2",
	            created_at: "Tue Jun 28 14:09:12 +0000 2016",
	            status_url: "https:\/\/twitter.com\/Niketas\/status\/747793978511101953",
	            caption: "Caption"
	        };
	
	        return data;
	    },
	
	    render: function render(data) {
	        return twitterTool.make(data);
	    }
	
	};
	
	twitterTool.content = {
	
	    /**
	     * Twitter render method appends content after block
	     * @param tweetId
	     */
	    twitter: function twitter(tweetId) {
	
	        var tweet = twitterTool.content.twitterBlock();
	
	        codex.content.switchBlock(codex.content.currentNode, tweet, 'twitter');
	
	        var blockContent = codex.content.currentNode.childNodes[0];
	        blockContent.classList.add('twitter__loader');
	
	        window.twttr.widgets.createTweet(tweetId, blockContent);
	
	        setTimeout(function () {
	            blockContent.classList.remove('twitter__loader');
	        }, 500);
	
	        /** Remove empty DIV */
	        blockContent.childNodes[0].remove();
	    },
	
	    twitterBlock: function twitterBlock() {
	        var block = codex.draw.node('DIV', '', {});
	        return block;
	    }
	};
	
	module.exports = {
	
	    type: 'twitter',
	    iconClassname: 'ce-icon-twitter',
	    prepare: twitterTool.prepare,
	    make: twitterTool.make,
	    appendCallback: null,
	    settings: null,
	    render: twitterTool.render,
	    save: twitterTool.save,
	    displayInToolbox: false,
	    enableLineBreaks: false,
	    allowedToPaste: false
	
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Instagram plugin
	 * @version 1.0.0
	 */
	var instagramTool = {
	
	    /**
	     * Prepare before usage
	     * Load important scripts to render embed
	     */
	    prepare: function prepare() {
	
	        var script = "//platform.instagram.com/en_US/embeds.js";
	
	        /**
	         * Load widget
	         */
	        codex.core.importScript(script, 'instagramAPI');
	    },
	
	    /**
	     * Make instagram embed via Widgets method
	     */
	    make: function make(data, isInternal) {
	
	        if (!data.instagram_url) return;
	
	        var block = instagramTool.content.instagramBlock(data.instagram_url);
	
	        if (isInternal) {
	
	            setTimeout(function () {
	
	                /** Render block */
	                instagramTool.content.render(block);
	            }, 200);
	        }
	
	        return block;
	
	        if (!isInternal) {
	            instagramTool.content.render(block);
	        }
	    },
	
	    /**
	     * Saving JSON output.
	     * Upload data via ajax
	     */
	    save: function save(blockContent) {
	
	        var data;
	
	        if (!blockContent) return;
	
	        /** Example */
	        data = {
	            instagram_url: blockContent.src
	        };
	
	        return data;
	    },
	
	    /**
	     * Render data
	     */
	    render: function render(data) {
	        return instagramTool.make(data);
	    }
	
	};
	
	instagramTool.content = {
	
	    render: function render(content) {
	
	        codex.content.switchBlock(codex.content.currentNode, content, 'instagram');
	
	        var blockContent = codex.content.currentNode.childNodes[0];
	        blockContent.classList.add('instagram__loader');
	
	        window.instgrm.Embeds.process();
	
	        setTimeout(function () {
	            blockContent.classList.remove('instagram__loader');
	        }, 500);
	    },
	
	    /**
	     * Drawing html content.
	     *
	     * @param url
	     * @returns {Element} blockquote - HTML template for Instagram Embed JS
	     */
	    instagramBlock: function instagramBlock(url) {
	
	        var blockquote = codex.draw.node('BLOCKQUOTE', 'instagram-media instagram', {}),
	            div = codex.draw.node('DIV', '', {}),
	            paragraph = codex.draw.node('P', 'ce-paste__instagram--p', {}),
	            anchor = codex.draw.node('A', '', { href: url });
	
	        blockquote.dataset.instgrmVersion = 4;
	
	        paragraph.appendChild(anchor);
	        div.appendChild(paragraph);
	        blockquote.appendChild(div);
	
	        return blockquote;
	    }
	
	};
	
	module.exports = {
	
	    type: 'instagram',
	    iconClassname: 'ce-icon-instagram',
	    prepare: instagramTool.prepare,
	    make: instagramTool.make,
	    appendCallback: null,
	    settings: null,
	    render: instagramTool.render,
	    save: instagramTool.save,
	    displayInToolbox: false,
	    enableLineBreaks: false,
	    allowedToPaste: false
	
	};

/***/ }
/******/ ]);
//# sourceMappingURL=plugins.js.map