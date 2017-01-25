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

            return wrapper;
        }
    };

    var services = {
        vimeo: {
            regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
            html: "<iframe src=\"https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>",
            height: 320,
            width: 580

        },
        youtube: {
            regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:[\?\&]t\=(\d*)|)/,
            html: "<iframe src=\"https://www.youtube.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>",
            height: 320,
            width: 580
        },
        coub: {
            regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
            html: "<iframe src=\"//coub.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>",
            height: 320,
            width: 580
        },
        vine: {
            regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
            html: "<iframe src=\"https://vine.co/v/<%= remote_id %>/embed/simple/\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>",
            height: 320,
            width: 580
        },
        imgur: {
            regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
            html: "<iframe allowfullscreen=\"true\" scrolling=\"no\" src=\"http://imgur.com/<%= remote_id %>/embed\" id=\"imgur-embed-iframe-pub-<%= remote_id %>\" class=\"imgur-embed-iframe-pub\" style=\"height: 500px; width: 540px; border: 1px solid #000\"></iframe>",
            height: 500,
            width: 540
        },
        gfycat: {
            regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
            html: "<iframe src='https://gfycat.com/ifr/<%= remote_id %>' frameborder='0' scrolling='no' width='580' height='436' allowfullscreen ></iframe>",
            height: 436,
            width: 580
        },
        'twitch-channel': {
            regex: /https?:\/\/twitch.tv\/([^\/\?\&]*)/,
            html: "<iframe src=\"https://player.twitch.tv/?channel=<%= remote_id %>\" frameborder=\"0\" allowfullscreen=\"true\" scrolling=\"no\" height=\"366\" width=\"600\"></iframe>",
            height: 366,
            width: 600
        },
        'twitch-video': {
            regex: /https?:\/\/www.twitch.tv\/[^\/\?\&]*\/v\/([0-9]*)/,
            html: "<iframe src=\"https://player.twitch.tv/?video=v<%= remote_id %>\" frameborder=\"0\" allowfullscreen=\"true\" scrolling=\"no\" height=\"366\" width=\"600\"></iframe>",
            height: 366,
            width: 600
        },
        'yandex-music-album': {
            regex: '',
            html: "<iframe frameborder=\"0\" style=\"border:none;width:540px;height:400px;\" width=\"540\" height=\"400\" src=\"https://music.yandex.ru/iframe/#album/<%= remote_id %>/\"></iframe>",
            height: 400,
            width: 540
        },
        'yandex-music-track': {
            regex: '',
            html: "<iframe frameborder=\"0\" style=\"border:none;width:540px;height:100px;\" width=\"540\" height=\"100\" src=\"https://music.yandex.ru/iframe/#track/<%= remote_id %>/\"></iframe>",
            height: 100,
            width: 540
        },
        'yandex-music-playlist': {
            regex: '',
            html: "<iframe frameborder=\"0\" style=\"border:none;width:540px;height:400px;\" width=\"540\" height=\"400\" src=\"https://music.yandex.ru/iframe/#playlist/<%= remote_id %>/show/cover/description/\"></iframe>",
            height: 400,
            width: 540
        }
    };


    embed.make = function(data, isInternal) {

        if (!data.remote_id)
            return;

        var html  = methods.getHtmlWithEmbedId(data.source, data.remote_id),
            block = methods.makeElementFromHtml(html);

        block.dataset.remoteId = data.remote_id;
        block.dataset.source = data.source;
        block.dataset.thumbnailUrl = data.thumbnailUrl;

        block.classList.add('embed');

        var sidePadding = (600 - services[data.source].width) / 2 + 'px';

        block.style.padding = '30px ' + sidePadding;

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

        if (!blockContent)
            return;

        var data,
            source = blockContent.dataset.source;

        data = {
            source: source,
            remote_id: blockContent.dataset.remoteId,
            thumbnailUrl: blockContent.dataset.thumbnailUrl,
            height: services[source].height,
            width: services[source].width
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

        var execArray = pattern.regex.exec(url),
            id;


        switch(pattern.type) {
            case 'yandex-music-track':
                id = execArray[2]+'/'+execArray[1];
                break;
            case 'yandex-music-playlist':
                id = execArray[1]+'/'+execArray[2];
                break;
            default:
                id = execArray[1];
        }

        var data = {
            source: pattern.type,
            remote_id: id,
            thumbnailUrl: url
        };

        embed.make(data, true);
    };

    return embed;

}({});