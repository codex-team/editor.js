/**
 * Video plugin by gohabereg
 * @version 1.0.0
 */
var videoTool = {

    make : function(data, isInternal) {

        if (!data.video_url)
            return;

        var properties = {
            width: '560',
            height: '315',
            src: data.video_url,
            frameborder: '0',
            allowfullscreen: true
        };

        var frame = codex.draw.node('IFRAME', 'video', properties);

        if (isInternal) {

            frame.src = videoTool.content.makeEmbedUrl(data.video_url);

            setTimeout(function() {

                /** Render block */
                videoTool.content.render(frame);

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
            video_url: blockContent.src
        };

        return data;

    },

    /**
     * Render data
     */
    render : function(data) {
        return videoTool.make(data);
    }

};

videoTool.content = {

    render: function (content) {
        codex.content.switchBlock(codex.content.currentNode, content, 'video');

        var blockContent = codex.content.currentNode.childNodes[0];
        blockContent.classList.add('video__loader');

        setTimeout(function(){
            blockContent.classList.remove('video__loader');
        }, 1000);

    },

    makeEmbedUrl: function (url) {

        return url.replace(/watch\?v=/, 'embed/');

    }
};
