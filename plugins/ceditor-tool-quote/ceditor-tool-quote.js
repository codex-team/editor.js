/**
* Codex Team
* @author Khaydarov Murod
*/

var quoteTools = {

    captionPlaceholder  : 'Введите имя автора',
    jobPlacaholder      : 'Введите должность',
    /**
    * Make Quote from JSON datasets
    */
    makeBlockToAppend : function(data) {

        var tag;

        if (data && data.type) {

            switch (data.type) {
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

            tag = document.createElement('BLOCKQUOTE');

            tag.contentEditable = 'true';
            tag.dataset.quoteStyle = 'simple';
            tag.class = 'ce_quote--text';

        }
        return tag;
    },

    render : function(data) {
        return quoteTools.makeBlockToAppend(data);
    },

    save : function(block) {

        /**
        * Extracts JSON quote data from HTML block
        * @param {Text} text, {Text} author, {Object} photo
        */
        parsedblock = quoteTools.parseBlockQuote(block);

        var data = {
            type    : 'quote',
            style   : parsedblock.style,
            text    : parsedblock.quote,
            author  : parsedblock.author,
            job     : parsedblock.job,
            photo   : parsedblock.photo,
        };

        return data;
    },

    makeSettings : function(data) {

        var holder  = document.createElement('DIV'),
            caption = document.createElement('SPAN'),
            types   = {
                        simple      : 'Простая цитата',
                        withCaption : 'Цитата с подписью',
                        withPhoto   : 'Цитата с фото и ФИО'
                    },
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_quote--settings'

        /** Add settings helper caption */
        caption.textContent = 'Настройки цитат';
        caption.className   = 'ce_plugin_quote--caption';

        holder.appendChild(caption);

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];

            selectTypeButton.className   = 'ce_plugin_quote--select_button';

            var quoteStyle = quoteTools.selectTypeQuoteStyle(type);
            quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    },

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

    addSelectTypeClickListener : function(el, quoteStyle) {

        el.addEventListener('click', function () {

            /**
            * Parsing currentNode to JSON.
            */
            var parsedOldQuote  = quoteTools.parseBlockQuote(),
                newStyledQuote  = quoteStyle(parsedOldQuote);

            cEditor.content.replaceBlock(cEditor.content.currentNode, newStyledQuote, 'quote');

            /** Close settings after replacing */
            cEditor.toolbar.settings.close();

        }, false);

    },

    setBlockHandler : function(block) {

    },

    makeSimpleQuote : function(data) {

        var wrapper = quoteTools.ui.blockquote();

        wrapper.innerHTML = data.text || '';

        wrapper.classList.add('ce_quote--text');

        wrapper.dataset.quoteStyle = 'simple';

        wrapper.contentEditable = 'true';

        return wrapper;
    },

    makeQuoteWithCaption : function(data) {

        var wrapper = quoteTools.ui.blockquote(),
            text    = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withCaption--blockquote', 'ce_quote--text']),
            author  = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withCaption--author', 'ce_quote--author']);

            /* make text block ontentEditable */
            text.contentEditable = 'true';

            text.innerHTML = data.text;

            /* make Author contentEditable */
            author.contentEditable = 'true';

            author.textContent = data.author || quoteTools.captionPlaceholder;

            quoteTools.ui.mousedown(author, quoteTools.captionPlaceholder);
            quoteTools.ui.keyPressed(author, quoteTools.captionPlaceholder);


        /* Appending created components */
        wrapper.dataset.quoteStyle = 'withCaption';

        wrapper.appendChild(text);
        wrapper.appendChild(author);

        return wrapper;

    },

    makeQuoteWithPhoto : function(data) {

        var wrapper  = quoteTools.ui.blockquote();
            photo    = quoteTools.ui.makeBlock('IMG', ['quoteStyle-withPhoto--photo']),
            author   = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--author', 'ce_quote--author']),
            job      = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--job', 'ce_quote--job']),
            quote    = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--quote', 'ce_quote--text'])

            /* Default Image src */
            photo.src = data.photo || '../img/01.jpg';

            /* make author block contentEditable */
            author.contentEditable = 'true';
            author.textContent = data.author || quoteTools.captionPlaceholder;

            quoteTools.ui.mousedown(author, quoteTools.captionPlaceholder);
            quoteTools.ui.keyPressed(author, quoteTools.captionPlaceholder);

            /*  Author's position and job */
            job.contentEditable = 'true';
            job.textContent = data.job || quoteTools.jobPlacaholder;

            quoteTools.ui.mousedown(job, quoteTools.jobPlacaholder);
            quoteTools.ui.keyPressed(job, quoteTools.jobPlacaholder);

        var authorsWrapper = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--authorWrapper']);
            authorsWrapper.appendChild(author);
            authorsWrapper.appendChild(job);

            /* make quote text contentEditable */
            quote.contentEditable = 'true';
            quote.innerHTML = data.text;

        wrapper.classList.add('quoteStyle-withPhoto--wrapper');
        wrapper.dataset.quoteStyle = 'withPhoto';

        wrapper.appendChild(photo);
        wrapper.appendChild(authorsWrapper);
        wrapper.appendChild(quote);

        return wrapper;
    },

    parseBlockQuote : function(block) {

        var currentNode = block || cEditor.content.currentNode,
            photo       = currentNode.getElementsByTagName('img')[0],
            author      = currentNode.querySelector('.ce_quote--author'),
            job         = currentNode.querySelector('.ce_quote--job'),
            quote ;

        /** Simple quote text placed in Blockquote tag*/
        if ( currentNode.dataset.quoteStyle == 'simple' )
            quote = currentNode.textContent;
        else
            quote = currentNode.querySelector('.ce_quote--text').textContent;

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

    makeBlock : function(tag, classList) {

        var el = document.createElement(tag);


        if ( classList ) {

            for( var i = 0; i < classList.length; i++)
                el.className += ' ' + classList[i];

        }
        return el;

    },

    mousedown : function(block, placeholder) {

        block.addEventListener('focus', function() {

            quoteTools.ui.clear(block, placeholder);

        });

    },

    keyPressed : function(block, placeholder) {

        block.addEventListener('keydown', function(){

            quoteTools.ui.fillbyPlaceholder(block, placeholder);

        });

    },

    clear : function(block, placeholder) {

        if ( block.textContent == placeholder) {
            block.innerHTML = '';
        }
    },

    fillbyPlaceholder : function(block, placeholder) {

        quoteTools.ui.clear(block, placeholder);

        setTimeout( function() {

            if (block.textContent == '') {
                block.textContent = placeholder;
            }

        }, 10);

    }
}

cEditor.tools.quote = {

    type            : 'quote',
    iconClassname   : 'ce-icon-quote',
    make            : quoteTools.makeBlockToAppend,
    appendCallback  : null,
    settings        : quoteTools.makeSettings(),
    render          : quoteTools.render,
    save            : quoteTools.save,

};
