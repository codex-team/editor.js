/**
 * Video plugin by gohabereg
 * @version 1.0.0
 */
var video = function(video){

    var methods = {

        addInternal: function (content) {
            codex.content.switchBlock(codex.content.currentNode, content, 'video_extended');

            var blockContent = codex.content.currentNode.childNodes[0];
            blockContent.classList.add('video__loader');

            setTimeout(function(){
                blockContent.classList.remove('video__loader');
            }, 1000);

        },

        getHtmlWithVideoId: function (type, id) {
            return services[type].html.replace(/<\%\= remote\_id \%\>/g, id);
        },

        makeElementFromHtml: function(html) {
            var wrapper = document.createElement('DIV');
            wrapper.innerHTML = html;
            return wrapper.firstElementChild;
        }
    };

    var services = {
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
            html: "<video width=\"100%\" autoplay=\"\" preload=\"preload\" loop=\"\" style=\"opacity: 1;\"><source src=\"http://i.imgur.com/<%= remote_id %>.mp4\"></video>"
        },
        gfycat: {
            regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
            html: "<iframe src='https://gfycat.com/ifr/<%= remote_id %>' frameborder='0' scrolling='no' width='580' height='436' allowfullscreen ></iframe>"
        }
    };


    video.make = function(data, isInternal) {

        if (!data.remote_id)
            return;

        var html  = methods.getHtmlWithVideoId(data.source, data.remote_id),
            block = methods.makeElementFromHtml(html);

        block.dataset.id = data.remote_id;
        block.dataset.videoService = data.source;
        block.dataset.thumbnailUrl = data.thumbnailUrl;

        if (isInternal) {
            methods.addInternal(block);
        }

        return block;

    };

    /**
     * Saving JSON output.
     * Upload data via ajax
     */
    video.save = function(blockContent) {

        var data;

        if (!blockContent)
            return;

        data = {
            remote_id: blockContent.dataset.id,
            source: blockContent.dataset.videoService,
            thumbnailUrl : blockContent.dataset.thumbnailUrl,
            width: null,
            height: null,
            time: 0
        };

        return data;

    };

    /**
     * Render data
     */
    video.render = function(data) {
        return video.make(data);
    };

    video.urlPastedCallback = function(url, pattern) {

        var id = pattern.regex.exec(url)[1];

        var data = {
            remote_id: id,
            thumbnailUrl: url,
            source: pattern.type
        };

        video.make(data, true);
    };

    return video;

}({});