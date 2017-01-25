/**
 * Paste plugin.
 *
 * Listens on paste event and pastes content from:
 *  - Instagram
 *  - Twitter
 *  - VK
 *  - Facebook
 *  - Image
 *  - External Link
 *
 */

/**
 * @protected
 *
 * Main tool settings.
 */
var pasteTool = {

};

/**
 * Make elements to insert or switch
 *
 * @uses Core codex.draw module
 */
pasteTool.ui = {

    /**
     * Upload image by URL
     *
     * @uses codex Image tool
     * @param image
     * @returns {Element}
     */
    uploadedImage : function(image) {

        var data = {
            background: false,
            border: false,
            isStretch: false,
            file: {
                url: image.file.url,
                bigUrl: image.file.bigUrl,
                width: image.file.width,
                height: image.file.height,
                additionalData: image.file.additionalData
            },
            caption: '',
            cover: null
        };

        /** Using Image plugin make method */
        var image_plugin = codex.tools.image_extended.make(data);

        return image_plugin;

    }

};


/**
 *
 * Callbacks
 */
pasteTool.callbacks = {

    /**
     * Saves data
     * @param event
     */
    pasted : function(event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text');

        pasteTool.callbacks.analize(content);
    },

    /**
     * Analizes pated string and calls necessary method
     */
    analize : function(string) {

        var regexTemplates = {
                // image : /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
                image : /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg))/,
                instagram : new RegExp("http?.+instagram.com\/p?."),
                twitter : /^http(s)?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/,
                facebook : /https?.+facebook.+\/\d+\?/,
                vk : /https?.+vk?.com\/feed\?w=wall\d+_\d+/,
                video : {
                    vimeo: {
                        regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
                        html: "<iframe src=\"<%= protocol %>//player.vimeo.com/video/<%= remote_id %>?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
                    },
                    youtube: {
                        regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:[\?\&]t\=(\d*)|)/,
                        html: "<iframe src=\"<%= protocol %>//www.youtube.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>",
                        timestamp: '?t='
                    },
                    coub: {
                        regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
                        html: "<iframe src=\"https://coub.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
                    },
                    vine: {
                        regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
                        html: "<iframe src=\"https://vine.co/v/<%= remote_id %>/embed/simple/\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
                    },
                    vk: {
                        regex: /https?:\/\/vk\.com\/.*(?:video)([-_0-9]+)/,
                        html: "<iframe src=\"https://tjournal.ru/proxy/video/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
                    },
                    imgur: {
                        regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
                        html: "<blockquote class=\"imgur-embed-pub\" lang=\"en\" data-id=\"<%= remote_id %>\" data-context=\"false\"></blockquote><script async src=\"//s.imgur.com/min/embed.js\" charset=\"utf-8\"></script>",
                        square: true
                    },
                    gfycat: {
                        regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
                        html: "<iframe src='https://gfycat.com/ifr/<%= remote_id %>' frameborder='0' scrolling='no' width='580' style='-webkit-backface-visibility: hidden;-webkit-transform: scale(1);' ></iframe>",
                        square: true
                    }
                }
            },

            image  = regexTemplates.image.test(string),
            instagram = regexTemplates.instagram.exec(string),
            twitter = regexTemplates.twitter.test(string),
            facebook = regexTemplates.facebook.test(string),
            youtube = regexTemplates.video.youtube.regex.test(string),
            vk = regexTemplates.vk.test(string);

        if (image) {

            pasteTool.callbacks.uploadImage(string);

        } else if (instagram) {

            pasteTool.callbacks.instagramMedia(instagram);

        } else if (twitter) {

            pasteTool.callbacks.twitterMedia(string);

        } else if (youtube) {

            pasteTool.callbacks.youtubeMedia(string);

        } else if (facebook) {

            pasteTool.callbacks.facebookMedia(string);

        } else if (vk) {

            pasteTool.callbacks.vkMedia(string);

        }

    },

    /**
     * Direct upload
     * @param url
     */
    uploadImage : function(path) {

        var ajaxUrl = location.protocol + '//' + location.hostname,
            file,
            image,
            current = codex.content.currentNode,
            beforeSend,
            success_callback;

        /** When image is uploaded to redactors folder */
        success_callback = function(data) {

            var file = JSON.parse(data);
            image = pasteTool.ui.uploadedImage(file);
            codex.content.switchBlock(current, image, 'image_extended');

        };

        /** Before sending XMLHTTP request */
        beforeSend = function() {
            var content = current.querySelector('.ce-block__content');
            content.classList.add('ce-plugin-image__loader');
        };

        /** Preparing data for XMLHTTP */
        var data = {
            url: '/club/fetchImage',
            type: "POST",
            data : {
                url: path
            },
            beforeSend : beforeSend,
            success : success_callback
        };

        codex.core.ajax(data);
    },

    /**
     * callback for instagram url's
     * Using instagram Embed Widgete to render
     * @uses Instagram tool
     * @param url
     */
    instagramMedia : function(url) {

        var fullUrl = url.input,
            data;


        data = {
            instagram_url: fullUrl
        };

        codex.tools.instagram.make(data, true);

    },

    /**
     * callback for tweets
     * Using Twittter Widget to render
     * @uses Twitter tool
     * @param url
     */
    twitterMedia : function(url) {

        var fullUrl = Array.isArray(url) ? url.input : url,
            tweetId,
            arr,
            data;

        arr = fullUrl.split('/');
        tweetId = arr.pop();

        /** Example */
        data = {
            id: tweetId,
            id_str: tweetId,
            status_url: fullUrl
        };

        codex.tools.tweet.make(data);
    },

    /**
     * callback for youtube url's
     * Using iframe to render
     * @uses video tool
     * @param url
     */
    youtubeMedia : function(url) {

        var list = url.split('/'),
            src  = list[list.length - 1];

        var data = {
            "source":"youtube",
            "remote_id": src,
            "thumbnailUrl": url
        };

        codex.tools.video_extended.make(data);
    }

};
