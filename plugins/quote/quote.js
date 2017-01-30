/**
 *
 * Quote plugin
 */

var quote = (function(quote) {

    /**
     * @private
     *
     * CSS styles
     */
    var elementClasses_ = {

        ce_quote     : 'ce-quote',
        quoteText    : 'ce_quote--text',
        quoteAuthor  : 'ce_quote--author',
        authorsJob   : 'ce_quote--job',
        authorsPhoto : 'authorsPhoto',
        authorsPhotoWrapper : 'authorsPhoto-wrapper',
        authorsPhotoWrapper_preview : 'authorsPhotoWrapper_preview',

        simple : {
            text : 'quoteStyle-simple--text'
        },

        withCaption : {
            blockquote : 'quoteStyle-withCaption--blockquote',
            author     : 'quoteStyle-withCaption--author'
        },

        withPhoto : {
            photo   : 'quoteStyle-withPhoto--photo',
            author  : 'quoteStyle-withPhoto--author',
            job     : 'quoteStyle-withPhoto--job',
            quote   : 'quoteStyle-withPhoto--quote',
            wrapper : 'quoteStyle-withPhoto--wrapper',
            authorHolder : 'quoteStyle-withPhoto--authorWrapper'
        },

        settings  : {
            holder  : 'ce_plugin_quote--settings',
            caption : 'ce_plugin_quote--caption',
            buttons : 'ce_plugin_quote--select_button',
            selectedType : 'ce-quote-settings--selected'
        }
    };

    /**
     * @private
     *
     *
     */
    var methods_ = {

        changeStyleClicked : function() {

            var changeStyleButton = this,
                quote = codex.content.currentNode.querySelector('.' + elementClasses_.ce_quote),
                newStyle = changeStyleButton.dataset.style,
                styleSelectors = this.parentNode.childNodes;

            quote.dataset.quoteStyle = newStyle;

            /**
             * Mark selected style button
             */
            for (var i = styleSelectors.length - 1; i >= 0; i--) {
                styleSelectors[i].classList.remove(elementClasses_.settings.selectedType);
            }

            this.classList.add(elementClasses_.settings.selectedType);

        },

        /**
         * @deprecated
         */
        selectTypeQuoteStyle : function(type) {

            var quoteStyleFunction;

            /**
             *  Choose Quote style to replace
             */
            switch (type) {
                case 'simple':
                    quoteStyleFunction = methods_.makeSimpleQuote;
                    break;
                case 'withCaption':
                    quoteStyleFunction = methods_.makeQuoteWithCaption;
                    break;
                case 'withPhoto':
                    quoteStyleFunction = methods_.makeQuoteWithPhoto;
                    break;
            }

            return quoteStyleFunction;

        },

        /**
         * @deprecated
         */
        addSelectTypeClickListener : function(el, quoteStyle) {

            el.addEventListener('click', function () {

                /**
                 * Parsing currentNode to JSON.
                 */
                var parsedOldQuote  = methods_.parseBlockQuote(),
                    newStyledQuote  = quoteStyle(parsedOldQuote);

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
        makeSimpleQuote : function(data) {

            var wrapper = ui_.makeBlock('BLOCKQUOTE', [elementClasses_.simple.text, elementClasses_.quoteText]);

            wrapper.innerHTML = data.text || '';

            wrapper.dataset.quoteStyle = 'simple';
            wrapper.classList.add(elementClasses_.ce_quote);
            wrapper.contentEditable = 'true';

            return wrapper;
        },

        /**
         * @deprecated
         */
        makeQuoteWithCaption : function(data) {

            var wrapper = ui_.blockquote(),
                text    = ui_.makeBlock('DIV', [elementClasses_.withCaption.blockquote, elementClasses_.quoteText]),
                author  = ui_.makeBlock('DIV', [elementClasses_.withCaption.author, elementClasses_.quoteAuthor]);

            /* make text block ontentEditable */
            text.contentEditable = 'true';

            text.innerHTML = data.text;

            /* make Author contentEditable */
            author.contentEditable = 'true';

            author.textContent = data.cite;

            /* Appending created components */
            wrapper.dataset.quoteStyle = 'withCaption';
            wrapper.classList.add(elementClasses_.ce_quote);

            wrapper.appendChild(text);
            wrapper.appendChild(author);

            return wrapper;

        },

        makeQuoteWithPhoto : function(data) {

            var wrapper  = ui_.blockquote(),
                photo    = ui_.makeBlock('DIV', [elementClasses_.withPhoto.photo]),
                author   = ui_.makeBlock('DIV', [elementClasses_.withPhoto.author, elementClasses_.quoteAuthor]),
                job      = ui_.makeBlock('DIV', [elementClasses_.withPhoto.job, elementClasses_.authorsJob]),
                quote    = ui_.makeBlock('DIV', [elementClasses_.withPhoto.quote, elementClasses_.quoteText]);

            /* Default Image src */
            if (!data.image) {

                var icon = ui_.makeBlock('SPAN', ['ce-icon-picture']);
                photo.appendChild(icon);

            } else {

                var authorsPhoto = ui_.img(elementClasses_.authorsPhoto);

                authorsPhoto.src = data.image;
                authorsPhoto.dataset.bigUrl = data.image;

                photo.classList.add(elementClasses_.authorsPhotoWrapper);
                photo.appendChild(authorsPhoto);
            }


            photo.addEventListener('click', fileUploadClicked_, false);

            /* make author block contentEditable */
            author.contentEditable = 'true';
            author.textContent = data.cite;

            /*  Author's position and job */
            job.contentEditable = 'true';
            job.textContent = data.caption;

            var authorsWrapper = ui_.makeBlock('DIV', [elementClasses_.withPhoto.authorHolder]);
            authorsWrapper.appendChild(author);
            authorsWrapper.appendChild(job);

            /* make quote text contentEditable */
            quote.contentEditable = 'true';
            quote.innerHTML = data.text;

            wrapper.classList.add(elementClasses_.ce_quote);
            wrapper.classList.add(elementClasses_.withPhoto.wrapper);
            wrapper.dataset.quoteStyle = 'withPhoto';

            wrapper.appendChild(quote);
            wrapper.appendChild(photo);
            wrapper.appendChild(authorsWrapper);

            return wrapper;
        },

        parseBlockQuote : function(block) {

            var currentNode = block || codex.content.currentNode,
                photo       = currentNode.getElementsByTagName('img')[0],
                author      = currentNode.querySelector('.' + elementClasses_.quoteAuthor),
                job         = currentNode.querySelector('.' + elementClasses_.authorsJob),
                quote ;

            /** Simple quote text placed in Blockquote tag*/
            if ( currentNode.dataset.quoteStyle == 'simple' )
                quote = currentNode.innerHTML;
            else
                quote = currentNode.querySelector('.' + elementClasses_.quoteText).innerHTML;

            if (job)
                job = job.textContent;

            if (author)
                author = author.textContent;

            if (photo)
                photo = photo.dataset.bigUrl;

            var data = {
                style       : currentNode.dataset.quoteStyle,
                text        : quote,
                author      : author,
                job         : job,
                photo       : photo
            };

            return data;
        }
    };

    /**
     * @private
     *
     * Author image Uploader
     */
    var fileUploadClicked_ = function() {

        var beforeSend  = photoUploadingCallbacks_.beforeSend,
            success     = photoUploadingCallbacks_.success,
            error       = photoUploadingCallbacks_.error;

        codex.transport.selectAndUpload({
            beforeSend: beforeSend,
            success: success,
            error: error
        });

    };

    /**
     * @private
     *
     */
    var ui_ = {

        wrapper : function($classList) {

            var el = document.createElement('DIV');

            el.classList.add($classList);

            return el;

        },

        blockquote : function() {

            var el = document.createElement('BLOCKQUOTE');

            return el;

        },

        img : function(attribute) {

            var imageTag = document.createElement('IMG');
            imageTag.classList.add(attribute);

            return imageTag;
        },

        makeBlock : function(tag, classList) {

            var el = document.createElement(tag);

            if ( classList ) {

                for( var i = 0; i < classList.length; i++)
                    el.className += ' ' + classList[i];

            }

            return el;

        }

    };



    /**
     * @private
     *
     * Callbacks
     */
    var photoUploadingCallbacks_ = {

        preview_ : function(e) {

            var uploadImageWrapper = codex.content.currentNode.querySelector('.' + elementClasses_.withPhoto.photo),
                authorsPhoto = ui_.img(elementClasses_.authorsPhoto);

            /** Appending uploaded image */
            uploadImageWrapper.classList.add(elementClasses_.authorsPhotoWrapper, elementClasses_.authorsPhotoWrapper_preview);

            authorsPhoto.src = e.target.result;

            /** Remove icon from image wrapper */
            uploadImageWrapper.innerHTML = '';

            uploadImageWrapper.appendChild(authorsPhoto);
        },

        beforeSend : function() {

            var input = codex.transport.input,
                files = input.files,
                file  = files[0],
                fileReader = new FileReader();

            fileReader.readAsDataURL(file);

            fileReader.onload = photoUploadingCallbacks_.preview_;

        },

        /**
         * Success callbacks for uploaded photo.
         * Replace upload icon with uploaded photo
         */
        success : function(result) {

            var parsed   = JSON.parse(result),
                filename = parsed.filename,
                uploadImageWrapper = codex.content.currentNode.querySelector('.' + elementClasses_.withPhoto.photo);

            var img = uploadImageWrapper.querySelector('IMG');
            img.src = parsed.data.file.bigUrl;
            img.dataset.bigUrl = parsed.data.file.bigUrl;

            uploadImageWrapper.classList.remove(elementClasses_.authorsPhotoWrapper_preview);
        },

        /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
        error : function(result) {
            console.log('Can\'t upload an image');
        }

    };

    /**
     * @private
     *
     * Make Quote from JSON datasets
     */
    var make_ = function(data) {

        var tag;

        if (data && data.size) {

            data.style = quote.config.defaultStyle;

            /**
             * Supported types
             */
            switch (data.style) {

                case 'simple':
                    tag = methods_.makeSimpleQuote(data);
                    break;
                case 'withCaption':
                    tag = methods_.makeQuoteWithCaption(data);
                    break;
                case 'withPhoto':
                    tag = methods_.makeQuoteWithPhoto(data);
                    break;
            }

            tag.dataset.quoteStyle = data.size;

        } else {

            var settings = {
                "text"   : null,
                "format" : "html",
                "cite"   : null,
                "caption": null,
                "size"   : null,
                "image"  : null
            };

            tag = methods_.makeQuoteWithPhoto(settings);
        }

        return tag;
    };

    var prepareDataForSave_ = function(data) {

        if (data.size == 'withPhoto') {
            data.size = 'small';
        }

        /** Make paragraphs */
        data.text = codex.content.makeParagraphsFromContent(data.text);

        return data;
    };

    /**
     * @public
     *
     * Renderer
     *
     * @param data
     */
    quote.render = function(data) {
        return make_(data);
    };

    quote.validate = function(output) {

        if (typeof output.text != "string") {
            return;
        }

        return output;
    };

    quote.save = function(blockContent) {

        /**
         * Extracts JSON quote data from HTML block
         * @param {Text} text, {Text} author, {Object} photo
         */
        var parsedblock = methods_.parseBlockQuote(blockContent);

        var outputData = {
            "text"   : parsedblock.text,
            "format" : "html",
            "cite"   : parsedblock.author,
            "caption": parsedblock.job,
            "size"   : parsedblock.style,
            "image"  : parsedblock.photo
        };

        return prepareDataForSave_(outputData);
    };

    /**
     * @public
     *
     * Draws settings
     */
    quote.makeSettings = function(data) {

        var holder  = document.createElement('DIV'),
            types   = {
                big : 'По центру',
                small : 'Врезка'
            },
            selectTypeButton;

        /** Add holder classname */
        holder.className = elementClasses_.settings.holder;

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = elementClasses_.settings.buttons;

            selectTypeButton.dataset.style = type;

            if ( type == quote.config.defaultStyle ){
                selectTypeButton.classList.add(quoteTools.styles.settings.selectedType);
            }

            // var quoteStyle = quoteTools.selectTypeQuoteStyle(type);

            selectTypeButton.addEventListener('click', methods_.changeStyleClicked, false);
            // quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    };

    /**
     * @public
     * Default path to redactors images
     * @type {null}
     */
    quote.path = null;

    /**
     * @public
     *
     * @type {null}
     */
    quote.config = null;

    /**
     * @public
     *
     * @param config
     */
    quote.prepare = function(config) {
        quote.config = config;
    };

    return quote;

})({});