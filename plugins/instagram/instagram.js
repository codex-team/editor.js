/**
 * Instagram plugin
 * @version 1.0.0
 */
var instagramTool = {

    /**
     * Prepare before usage
     * Load important scripts to render embed
     */
    prepare : function() {

        var script = "//platform.instagram.com/en_US/embeds.js";

        /**
         * Load widget
         */
        codex.core.importScript(script, 'instagramAPI');
    },

    /**
     * Make instagram embed via Widgets method
     */
    make : function(data, isInternal) {

        if (!data.instagram_url)
            return;

        var block = instagramTool.content.instagramBlock(data.instagram_url);

        if (isInternal) {

            setTimeout(function() {

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
    save : function(blockContent) {

        var data;

        if (!blockContent)
            return;

        /** Example */
        data = {
            instagram_url: blockContent.src
        };

        return data;

    },

    /**
     * Render data
     */
    render : function(data) {
        return instagramTool.make(data);
    }

};

instagramTool.content = {

    render : function(content) {

        codex.content.switchBlock(codex.content.currentNode, content, 'instagram');

        var blockContent = codex.content.currentNode.childNodes[0];
        blockContent.classList.add('instagram__loader');

        window.instgrm.Embeds.process();

        setTimeout(function(){
            blockContent.classList.remove('instagram__loader');
        }, 500);
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

// instagramTool = {
//
//     type             : 'instagram',
//     iconClassname    : 'ce-icon-instagram',
//     prepare          : instagramTool.prepare,
//     make             : instagramTool.make,
//     appendCallback   : null,
//     settings         : null,
//     render           : instagramTool.render,
//     save             : instagramTool.save,
//     displayInToolbox : false,
//     enableLineBreaks : false,
//     allowedToPaste   : false
//
// };
