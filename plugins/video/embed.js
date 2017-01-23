/**
 * Embed plugin by gohabereg
 * @version 1.0.0
 */
var embed = function(embed){

    var methods = {

        addInternal: function (content) {
            codex.content.switchBlock(codex.content.currentNode, content, 'embed');

            var blockContent = codex.content.currentNode.childNodes[0];
            blockContent.classList.add('embed__loader');

            setTimeout(function(){
                blockContent.classList.remove('embed__loader');
            }, 1000);

        },

        getHtmlWithEmbedId: function (type, id) {
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
            html: "<iframe allowfullscreen=\"true\" scrolling=\"no\" src=\"http://imgur.com/<%= remote_id %>/embed\" id=\"imgur-embed-iframe-pub-<%= remote_id %>\" class=\"imgur-embed-iframe-pub\" style=\"height: 500px; width: 540px; border: 1px solid #000\"></iframe>"
        },
        gfycat: {
            regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
            html: "<iframe src='https://gfycat.com/ifr/<%= remote_id %>' frameborder='0' scrolling='no' width='580' height='436' allowfullscreen ></iframe>",
        },
        'twitch-channel': {
            regex: /https?:\/\/twitch.tv\/([^\/\?\&]*)/,
            html: "<iframe src=\"https://player.twitch.tv/?channel=<%= remote_id %>\" frameborder=\"0\" allowfullscreen=\"true\" scrolling=\"no\" height=\"378\" width=\"620\"></iframe>"
        },
        'twitch-video': {
            regex: /https?:\/\/www.twitch.tv\/[^\/\?\&]*\/v\/([0-9]*)/,
            html: "<iframe src=\"https://player.twitch.tv/?video=v<%= remote_id %>\" frameborder=\"0\" allowfullscreen=\"true\" scrolling=\"no\" height=\"378\" width=\"620\"></iframe>"
        }
    };


    embed.make = function(data, isInternal) {

        if (!data.embed_id)
            return;

        var html  = methods.getHtmlWithEmbedId(data.service, data.embed_id),
            block = methods.makeElementFromHtml(html);

        block.dataset.id = data.embed_id;
        block.dataset.embedSeirvice = data.service;

        if (isInternal) {
                methods.addInternal(block);
        }

        return block;

    };

    /**
     * Saving JSON output.
     * Upload data via ajax
     */
    embed.save = function(blockContent) {

        var data;

        if (!blockContent)
            return;

        data = {
            embed_id: blockContent.dataset.id,
            service: blockContent.dataset.embedService
        };

        return data;

    };

    /**
     * Render data
     */
    embed.render = function(data) {
        return embed.make(data);
    };

    embed.urlPastedCallback = function(url, pattern) {

        var id = pattern.regex.exec(url)[1];

        var data = {
            embed_id: id,
            service: pattern.type
        };

        embed.make(data, true);
    };

    return embed;

}({});