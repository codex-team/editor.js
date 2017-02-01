/**
 * Instagram plugin
 * @version 1.0.0
 */
var instagram = (function(instagram) {

    var methods = {

        render : function(content) {

            codex.content.switchBlock(codex.content.currentNode, content, 'instagram');

            setTimeout(function() {
                window.instgrm.Embeds.process();
            }, 200);

        },

        /**
         * Drawing html content.
         *
         * @param url
         * @returns {Element} blockquote - HTML template for Instagram Embed JS
         */
        instagramBlock : function(url) {

            var blockquote = codex.draw.node('BLOCKQUOTE', 'instagram-media instagram', {}),
                div        = codex.draw.node('DIV', '', {}),
                paragraph  = codex.draw.node('P', 'ce-paste__instagram--p', {}),
                anchor     = codex.draw.node('A', '', { href : url });

            blockquote.dataset.instgrmVersion = 4;

            paragraph.appendChild(anchor);
            div.appendChild(paragraph);
            blockquote.appendChild(div);

            return blockquote;

        }
    };

    /**
     * Prepare before usage
     * Load important scripts to render embed
     */
    instagram.prepare = function() {

        return new Promise(function(resolve, reject){

            codex.core.importScript("https://platform.instagram.com/en_US/embeds.js", 'instagram-api').then(function(){
                resolve();
            }).catch(function(){
                reject(Error('Instagram API was not loaded'));
            });

        });
    };

    /**
     * @private
     *
     * Make instagram embed via Widgets method
     */
    var make_ = function(data, isInternal) {

        if (!data.instagram_url)
            return;

        var block = methods.instagramBlock(data.instagram_url);

        if (isInternal) {

            setTimeout(function() {

                /** Render block */
                methods.render(block);

            }, 200);
        }

        if (!isInternal) {
            methods.render(block);
        }

        return block;
    };

    instagram.validate = function(data) {
        return true;
    };

    /**
     * Saving JSON output.
     * Upload data via ajax
     */
    instagram.save = function(blockContent) {

        var data;

        if (!blockContent)
            return;

        /** Example */
        data = {
            instagram_url: blockContent.src
        };

        return data;

    };

    instagram.validate = function(data) {

        var checkUrl = new RegExp("http?.+instagram.com\/p?.");

        if (!data.instagram_url || checkUrl.exec(data.instagram_url).length == 0)
            return;

        return true;
    };

    /**
     * Render data
     */
    instagram.render = function(data) {
        return make_(data);
    };

    /**
     * callback for instagram url's coming from pasteTool
     * Using instagram Embed Widgete to render
     * @param url
     */
    instagram.urlPastedCallback = function(url) {
        var data = {
            instagram_url: url
        };

        make_(data, true);

    };

    return instagram;

})({});

