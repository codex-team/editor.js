/**
 * Youtube plugin by gohabereg
 * @version 1.0.0
 */
var youtubeTool = {

    make : function(data, isInternal) {

        if (!data.youtube_url)
            return;

        var properties = {
            width: '560',
            height: '315',
            src: data.youtube_url,
            frameborder: '0',
            allowfullscreen: true
        };

        var frame = codex.draw.node('IFRAME', 'youtube', properties);

        if (isInternal) {

            frame.src = youtubeTool.content.makeEmbedUrl(data.youtube_url);

            console.log(frame.src);

            setTimeout(function() {

                /** Render block */
                youtubeTool.content.render(frame);

            }, 200);
        }

        return frame;

    },

    /**
     * Saving JSON output.
     * Upload data via ajax
     */
    save : function(blockContent) {

        var data;

        if (!blockContent)
            return;

        data = {
            youtube_url: blockContent.src
        };

        return data;

    },

    /**
     * Render data
     */
    render : function(data) {
        return youtubeTool.make(data);
    }

};

youtubeTool.content = {

    render: function (content) {
        codex.content.switchBlock(codex.content.currentNode, content, 'youtube');

        var blockContent = codex.content.currentNode.childNodes[0];
        blockContent.classList.add('youtube__loader');

        setTimeout(function(){
            blockContent.classList.remove('youtube__loader');
        }, 500);
        
    },

    makeEmbedUrl: function (url) {

        return url.replace(/watch\?v=/, 'embed/');

    }
};
