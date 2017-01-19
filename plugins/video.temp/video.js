/**
 * Video plugin by gohabereg
 * @version 1.0.0
 */
var videoTool = {

    make : function(data) {

        if (!data.source && !data.thumbnailUrl)
            return;

        var properties = {
            "source":"youtube",
            "remote_id": data.source,
            "thumbnailUrl": data.thumbnailUrl,
            "time": 0,
            "width": 800,
            "height": 450,
            allowfullscreen: true
        };

        properties.width = properties.width > 600 ? 600 : properties.width;

        var frame  = codex.draw.node('IFRAME', data.type, properties),
            target = codex.content.currentNode;

        frame.src = videoTool.content.makeEmbedUrl(data.thumbnailUrl);

        if (!data.width && !data.height) {

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

        var list = blockContent.src.split('/'),
            src  = list[list.length - 1];

        data = {
            "source":"youtube",
            "remote_id": src,
            "thumbnailUrl": blockContent.src,
            "time": 0,
            "width": 800,
            "height": 450
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

        codex.content.switchBlock(codex.content.currentNode, content, 'video_extended');

        var blockContent = codex.content.currentNode.childNodes[0];
        blockContent.classList.add('video__loader');

        setTimeout(function(){
            blockContent.classList.remove('video__loader');
        }, 500);

    },

    makeEmbedUrl: function (url) {

        return url.replace(/watch\?v=/, 'embed/');

    }
};
