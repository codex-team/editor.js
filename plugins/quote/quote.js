/**
* Codex Team
* @author Khaydarov Murod
*/

var quote = (function(quote) {

    /** Default path to redactors images */
    var path = '/upload/redactor_images/';

    /**
     * Default quote style
     */
    var defaultStyle = 'withPhoto';

    var styles = {

        ce_quote     : 'ce-quote',
        quoteText    : 'ce_quote--text',
        quoteAuthor  : 'ce_quote--author',
        authorsJob   : 'ce_quote--job',
        authorsPhoto : 'authorsPhoto',
        authorsPhotoWrapper : 'authorsPhoto-wrapper',

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

    var photoUploadingCallbacks = {

        /**
         * Success callbacks for uploaded photo.
         * Replace upload icon with uploaded photo
         */
        success : function(result) {

            var parsed   = JSON.parse(result),
                filename = parsed.filename,
                uploadImageWrapper = codex.content.currentNode.querySelector('.' + styles.withPhoto.photo),
                authorsPhoto = ui.img(styles.authorsPhoto);

            authorsPhoto.src = path + 'b_' + filename;

            /** Remove icon from image wrapper */
            uploadImageWrapper.innerHTML = '';

            /** Appending uploaded image */
            uploadImageWrapper.classList.add(styles.authorsPhotoWrapper);
            uploadImageWrapper.appendChild(authorsPhoto);
        },

        /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
        error : function(result) {

            console.log('Can\'t upload an image');
            codex.notifications.errorThrown();

        }

    };

    var ui = {

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
     * Make Quote from JSON datasets
     */
    quote.makeBlockToAppend = function(data) {

        var tag;

        if (data && data.size) {

            data.style = 'withPhoto';

            switch (data.style) {
                case 'simple':
                    tag = makeSimpleQuote(data);
                    break;
                case 'withCaption':
                    tag = makeQuoteWithCaption(data);
                    break;
                case 'withPhoto':
                    tag = makeQuoteWithPhoto(data);
                    break;
            }
        } else {

            var settings = {
                style  : 'withPhoto',
                text   : '',
                author : '',
                job    : '',
                photo  : ''
            };

            tag = makeQuoteWithPhoto(settings);
        }

        return tag;
    };

    quote.validate = function(data) {

        if (data.style.trim() == '' || data.text.trim() == '' || data.cite.trim() == ''
            || data.size.trim() == '')
            return;

        return true;
    };

    quote.render = function(data) {
        return quote.makeBlockToAppend(data);
    };

    quote.save = function(blockContent) {

        /**
         * Extracts JSON quote data from HTML block
         * @param {Text} text, {Text} author, {Object} photo
         */
        var parsedblock = parseBlockQuote(blockContent);
        var data = {
            style  : parsedblock.style,
            text   : parsedblock.text,
            author : parsedblock.author,
            job    : parsedblock.job,
            photo  : parsedblock.photo,
            "format":"html",
            "cite": parsedblock.author,
            "size": "small"
        };

        return data;
    };

    quote.makeSettings = function(data) {

        var holder  = document.createElement('DIV'),
            types   = {
                simple      : 'Простая цитата',
                withCaption : 'Цитата с подписью',
                withPhoto   : 'Цитата с фото и ФИО'
            },
            selectTypeButton;

        /** Add holder classname */
        holder.className = styles.settings.holder;

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = styles.settings.buttons;

            selectTypeButton.dataset.style = type;

            if ( type == defaultStyle ){
                selectTypeButton.classList.add(styles.settings.selectedType);
            }

            // var quoteStyle = quoteTools.selectTypeQuoteStyle(type);

            selectTypeButton.addEventListener('click', changeStyleClicked, false);
            // quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    };


    var changeStyleClicked = function() {

        var changeStyleButton = this,
            quote = codex.content.currentNode.querySelector('.' + styles.ce_quote),
            newStyle = changeStyleButton.dataset.style,
            styleSelectors = this.parentNode.childNodes;

        quote.dataset.quoteStyle = newStyle;

        /**
         * Mark selected style button
         */
        for (var i = styleSelectors.length - 1; i >= 0; i--) {
            styleSelectors[i].classList.remove(styles.settings.selectedType);
        }

        this.classList.add(styles.settings.selectedType);

    };

    /**
     * @deprecated
     */
    var selectTypeQuoteStyle = function(type) {

        /**
         *  Choose Quote style to replace
         */
        switch (type) {
            case 'simple':
                quoteStyleFunction = makeSimpleQuote;
                break;
            case 'withCaption':
                quoteStyleFunction = makeQuoteWithCaption;
                break;
            case 'withPhoto':
                quoteStyleFunction = makeQuoteWithPhoto;
                break;
        }
        return quoteStyleFunction;
    };

    /**
     * @deprecated
     */
    var addSelectTypeClickListener = function(el, quoteStyle) {

        el.addEventListener('click', function () {

            /**
             * Parsing currentNode to JSON.
             */
            var parsedOldQuote  = parseBlockQuote(),
                newStyledQuote  = quoteStyle(parsedOldQuote);

            var wrapper = codex.content.composeNewBlock(newStyledQuote, 'quote');
            wrapper.appendChild(newStyledQuote);

            codex.content.switchBlock(codex.content.currentNode, newStyledQuote, 'quote');

            /** Close settings after replacing */
            codex.toolbar.settings.close();

        }, false);

    };

    /**
     * @deprecated
     */
    var makeSimpleQuote = function(data) {

        var wrapper = ui.makeBlock('BLOCKQUOTE', [styles.simple.text, styles.quoteText]);

        wrapper.innerHTML = data.text || '';

        wrapper.dataset.quoteStyle = 'simple';
        wrapper.classList.add(styles.ce_quote);
        wrapper.contentEditable = 'true';

        return wrapper;
    };

    /**
     * @deprecated
     */
    var makeQuoteWithCaption = function(data) {

        var wrapper = ui.blockquote(),
            text    = ui.makeBlock('DIV', [styles.withCaption.blockquote, styles.quoteText]),
            author  = ui.makeBlock('DIV', [styles.withCaption.author, styles.quoteAuthor]);

        /* make text block ontentEditable */
        text.contentEditable = 'true';

        text.innerHTML = data.text;

        /* make Author contentEditable */
        author.contentEditable = 'true';

        author.textContent = data.cite;

        /* Appending created components */
        wrapper.dataset.quoteStyle = 'withCaption';
        wrapper.classList.add(styles.ce_quote);

        wrapper.appendChild(text);
        wrapper.appendChild(author);

        return wrapper;

    };

    var makeQuoteWithPhoto = function(data) {

        var wrapper  = ui.blockquote(),
            photo    = ui.makeBlock('DIV', [styles.withPhoto.photo]),
            author   = ui.makeBlock('DIV', [styles.withPhoto.author, styles.quoteAuthor]),
            job      = ui.makeBlock('DIV', [styles.withPhoto.job, styles.authorsJob]),
            quote    = ui.makeBlock('DIV', [styles.withPhoto.quote, styles.quoteText]);

        /* Default Image src */
        if (!data.photo) {

            var icon = ui.makeBlock('SPAN', ['ce-icon-picture']);
            photo.appendChild(icon);

        } else {

            var authorsPhoto = ui.img(styles.authorsPhoto);
            authorsPhoto.src = data.photo;

            photo.classList.add(styles.authorsPhotoWrapper);
            photo.appendChild(authorsPhoto);
        }


        photo.addEventListener('click', fileUploadClicked, false);

        /* make author block contentEditable */
        author.contentEditable = 'true';
        author.textContent = data.cite;

        /*  Author's position and job */
        job.contentEditable = 'true';
        job.textContent = data.job;

        var authorsWrapper = ui.makeBlock('DIV', [styles.withPhoto.authorHolder]);
        authorsWrapper.appendChild(author);
        authorsWrapper.appendChild(job);

        /* make quote text contentEditable */
        quote.contentEditable = 'true';
        quote.innerHTML = data.text;

        wrapper.classList.add(styles.ce_quote);
        wrapper.classList.add(styles.withPhoto.wrapper);
        wrapper.dataset.quoteStyle = 'withPhoto';

        wrapper.appendChild(quote);
        wrapper.appendChild(photo);
        wrapper.appendChild(authorsWrapper);

        return wrapper;
    };

    var parseBlockQuote = function(block) {

        var currentNode = block || codex.content.currentNode,
            photo       = currentNode.getElementsByTagName('img')[0],
            author      = currentNode.querySelector('.' + styles.quoteAuthor),
            job         = currentNode.querySelector('.' + styles.authorsJob),
            quote ;

        /** Simple quote text placed in Blockquote tag*/
        if ( currentNode.dataset.quoteStyle == 'simple' )
            quote = currentNode.innerHTML;
        else
            quote = currentNode.querySelector('.' + styles.quoteText).innerHTML;

        if (job)
            job = job.textContent;

        if (author)
            author = author.textContent;

        if (photo)
            photo = photo.src;

        var data = {
            style       : currentNode.dataset.quoteStyle,
            text        : quote,
            author      : author,
            job         : job,
            photo       : photo
        };

        return data;
    };

    var fileUploadClicked = function() {

        var success = photoUploadingCallbacks.success,
            error   = photoUploadingCallbacks.error;

        codex.transport.selectAndUpload({
            success,
            error,
        });

    };

    return quote;

})({});