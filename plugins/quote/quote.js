/**
* Quote Plugin
*
* @author CodeX Team <team@ifmo.su>
* @version 0.0.1
*/

var quoteTools = {

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

            tag.classList.add('ce_quote--text');
            tag.classList.add('quoteStyle-simple--text');

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

            var wrapper = cEditor.content.composeNewBlock(newStyledQuote, 'quote');
            wrapper.appendChild(newStyledQuote);

            cEditor.content.replaceBlock(cEditor.content.currentNode, wrapper, 'quote');

            /** Close settings after replacing */
            cEditor.toolbar.settings.close();

        }, false);

    },

    makeSimpleQuote : function(data) {

        var wrapper = quoteTools.ui.makeBlock('BLOCKQUOTE', ['quoteStyle-simple--text', 'ce_quote--text']);

        wrapper.innerHTML = data.text || '';

        wrapper.dataset.quoteStyle = 'simple';

        wrapper.contentEditable = 'true';

        return wrapper;
    },

    makeQuoteWithCaption : function(data) {

        var blockquote  = quoteTools.ui.blockquote(),
            text    = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withCaption--blockquote', 'ce_quote--text']),
            author  = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withCaption--author', 'ce_quote--author']);

            /* make text block ontentEditable */
            text.contentEditable = 'true';

            text.innerHTML = data.text;

            /* make Author contentEditable */
            author.contentEditable = 'true';

            author.textContent = data.author;

        /* Appending created components */
        blockquote.dataset.quoteStyle = 'withCaption';

        blockquote.appendChild(text);
        blockquote.appendChild(author);

        return blockquote;

    },

    makeQuoteWithPhoto : function(data) {

        var wrapper  = quoteTools.ui.blockquote();
            photo    = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--photo']),
            author   = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--author', 'ce_quote--author']),
            job      = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--job', 'ce_quote--job']),
            quote    = quoteTools.ui.makeBlock('DIV', ['quoteStyle-withPhoto--quote', 'ce_quote--text'])

            /* Default Image src */
            var icon = quoteTools.ui.makeBlock('SPAN', ['ce-icon-picture']);
            photo.appendChild(icon);

            /* make author block contentEditable */
            author.contentEditable = 'true';
            author.textContent = data.author;

            /*  Author's position and job */
            job.contentEditable = 'true';
            job.textContent = data.job;

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

    }

};

cEditor.tools.quote = {

    type            : 'quote',
    iconClassname   : 'ce-icon-quote',
    make            : quoteTools.makeBlockToAppend,
    appendCallback  : null,
    settings        : quoteTools.makeSettings(),
    render          : quoteTools.render,
    save            : quoteTools.save,

};
