/**
 * Instagram plugin
 * @version 1.0.0
 */
var instagram = (function(instagram) {

    /**
     * Prepare before usage
     * Load important scripts to render embed
     */
    instagram.prepare = function() {

        var script = "//platform.instagram.com/en_US/embeds.js";

        /**
         * Load widget
         */
        codex.core.importScript(script, 'instagramAPI');
    };

    /**
     * Make instagram embed via Widgets method
     */
    instagram.make = function(data, isInternal) {

        if (!data.instagram_url)
            return;

        var block = instagramTool.content.instagramBlock(data.instagram_url);

        if (isInternal) {

            setTimeout(function() {

                /** Render block */
                instagramTool.content.render(block);

            }, 200);
        }

        if (!isInternal) {
            instagramTool.content.render(block);
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

    /**
     * Render data
     */
    instagram.render = function(data) {
        return instagram.make(data);
    };

    return instagram;

})({});
