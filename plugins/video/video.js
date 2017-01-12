/**
 * Video plugin by gohabereg
 * @version 1.0.0
 */
var videoTool = {

    make : function(data, isInternal) {

        if (!data.video_id)
            return;

        var html  = videoTool.content.getHtmlWithVideoId(data.service, data.video_id),
            block = videoTool.content.makeElementFromHtml(html);

        block.dataset.id = data.video_id;
        block.dataset.videoSeirvice = data.service;

        if (isInternal) {

            setTimeout(function() {

                /** Render block */
                videoTool.content.render(block);

            }, 200);
        }

        return block;

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
            video_id: blockContent.dataset.id,
            service: blockContent.dataset.videoService
        };

        return data;

    },

    /**
     * Render data
     */
    render : function(data) {
        return videoTool.make(data);
    },


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

    getHtmlWithVideoId: function (type, id) {
        return videoTool.content.services[type].html.replace(/<\%\= remote\_id \%\>/g, id);
    },

    makeElementFromHtml: function(html) {
        var wrapper = document.createElement('DIV');
        wrapper.innerHTML = html;
        return wrapper.firstElementChild;
    },

    services: {
        vimeo: {
            regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
            html: "<iframe src=\"https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
        },
        youtube: {
            regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:[\?\&]t\=(\d*)|)/,
            html: "<iframe src=\"https://www.youtube.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>",
            timestamp: '?t='
        },
        coub: {
            regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
            html: "<iframe src=\"//coub.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
        },
        vine: {
            regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
            html: "<iframe src=\"https://vine.co/v/<%= remote_id %>/embed/simple/\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
        },
        vk: {
            regex: /https?:\/\/vk\.com\/.*(?:video)([-_0-9]+)/,
            html: "<iframe src=\"//vk.com/video_ext.php?id=<%= remote_id %>\" width=\"853\" height=\"480\" frameborder=\"0\" allowfullscreen></iframe>"
        },
        imgur: {
            regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
            html: "<iframe allowfullscreen=\"true\" scrolling=\"no\" src=\"http://imgur.com/<%= remote_id %>/embed\" id=\"imgur-embed-iframe-pub-<%= remote_id %>\" class=\"imgur-embed-iframe-pub\" style=\"height: 500px; width: 540px; border: 1px solid #000\"></iframe>"
        },
        gfycat: {
            regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
            html: "<iframe src='https://gfycat.com/ifr/<%= remote_id %>' frameborder='0' scrolling='no' width='580' height='436' allowfullscreen ></iframe>",
        }
    }
};

videoTool.urlPastedCallbacks = {
    generalCallback: function(url, pattern) {

        var id = pattern.regex.exec(url)[1];

        var data = {
            video_id: id,
            service: pattern.type
        };

        videoTool.make(data, true);
    }
};