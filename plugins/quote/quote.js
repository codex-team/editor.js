/**
* Codex Team
* @author Khaydarov Murod
*/

var quoteTools = {

    /** Default path to redactors images */
    path : '/upload/redactor_images/',

    /**
    * Default quote style
    */
    defaultStyle : 'withPhoto',

    /**
    * Make Quote from JSON datasets
    */
    makeBlockToAppend : function(data) {

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
                style  : 'withPhoto',
                text   : '',
                author : '',
                job    : '',
                photo  : ''
            };

            tag = quoteTools.makeQuoteWithPhoto(settings);

        }

        return tag;
    },

    render : function(data) {
        return quoteTools.makeBlockToAppend(data);
    },

    save : function(blockContent) {

        /**
        * Extracts JSON quote data from HTML block
        * @param {Text} text, {Text} author, {Object} photo
        */
        var parsedblock = quoteTools.parseBlockQuote(blockContent);
            data = {
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
    },

    makeSettings : function(data) {

        var holder  = document.createElement('DIV'),
            types   = {
                        simple      : 'Простая цитата',
                        withCaption : 'Цитата с подписью',
                        withPhoto   : 'Цитата с фото и ФИО'
                    },
            selectTypeButton;

        /** Add holder classname */
        holder.className = quoteTools.styles.settings.holder;

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = quoteTools.styles.settings.buttons;

            selectTypeButton.dataset.style = type;

            if ( type == quoteTools.defaultStyle ){
                selectTypeButton.classList.add(quoteTools.styles.settings.selectedType);
            }

            // var quoteStyle = quoteTools.selectTypeQuoteStyle(type);

            selectTypeButton.addEventListener('click', quoteTools.changeStyleClicked, false);
            // quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    },

    changeStyleClicked : function() {

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
    selectTypeQuoteStyle : function(type) {

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
    addSelectTypeClickListener : function(el, quoteStyle) {

        el.addEventListener('click', function () {

            /**
            * Parsing currentNode to JSON.
            */
            var parsedOldQuote  = quoteTools.parseBlockQuote(),
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
    makeQuoteWithCaption : function(data) {

        var wrapper = quoteTools.ui.blockquote(),
            text    = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withCaption.blockquote, quoteTools.styles.quoteText]),
            author  = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withCaption.author, quoteTools.styles.quoteAuthor]);

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

    makeQuoteWithPhoto : function(data) {

        var wrapper  = quoteTools.ui.blockquote(),
            photo    = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.photo]),
            author   = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.author, quoteTools.styles.quoteAuthor]),
            job      = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.job, quoteTools.styles.authorsJob]),
            quote    = quoteTools.ui.makeBlock('DIV', [quoteTools.styles.withPhoto.quote, quoteTools.styles.quoteText]);

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

    parseBlockQuote : function(block) {

        var currentNode = block || codex.content.currentNode,
            photo       = currentNode.getElementsByTagName('img')[0],
            author      = currentNode.querySelector('.' + quoteTools.styles.quoteAuthor),
            job         = currentNode.querySelector('.' + quoteTools.styles.authorsJob),
            quote ;

        /** Simple quote text placed in Blockquote tag*/
        if ( currentNode.dataset.quoteStyle == 'simple' )
            quote = currentNode.innerHTML;
        else
            quote = currentNode.querySelector('.' + quoteTools.styles.quoteText).innerHTML;

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
            photo       : photo,
        };

        return data;
    },

    fileUploadClicked : function() {

        var success = quoteTools.photoUploadingCallbacks.success,
            error   = quoteTools.photoUploadingCallbacks.error;

        codex.transport.selectAndUpload({
            success,
            error,
        });

    }

};

quoteTools.styles = {

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

quoteTools.ui = {

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

quoteTools.photoUploadingCallbacks = {

    /**
    * Success callbacks for uploaded photo.
    * Replace upload icon with uploaded photo
    */
    success : function(result) {

        var parsed   = JSON.parse(result),
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
    error : function(result) {

        console.log('Can\'t upload an image');
        codex.notifications.errorThrown();

    }

};

// module.exports = {
//
//     type             : 'quote',
//     iconClassname    : 'ce-icon-quote',
//     make             : quoteTools.makeBlockToAppend,
//     appendCallback   : null,
//     settings         : quoteTools.makeSettings(),
//     render           : quoteTools.render,
//     save             : quoteTools.save,
//     displayInToolbox : true,
//     enableLineBreaks : true,
//     allowedToPaste   : true
//
// };
