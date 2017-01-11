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
     * @param filename
     * @returns {Element}
     */
    uploadedImage : function(filename) {

        var data = {
            background: false,
            border: false,
            isStretch: false,
            file: {
                url: "upload/redactor_images/" + filename,
                bigUrl: "upload/redactor_images/" + filename,
                width: null,
                height: null,
                additionalData: "null"
            },
            caption: '',
            cover: null
        };

        /** Using Image plugin make method */
        var image = codex.tools.image.make(data);

        return image;

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
                image : /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
                instagram : new RegExp("http?.+instagram.com\/p?."),
                twitter : new RegExp("http?.+twitter.com?.+\/"),
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
            twitter = regexTemplates.twitter.exec(string),
            facebook = regexTemplates.facebook.test(string),
            vk = regexTemplates.vk.test(string);

        /**
         * Video testing
         */
        var youtube = regexTemplates.video.youtube.regex.test(string);
        var vimeo   = regexTemplates.video.vimeo.regex.test(string);
        var coub    = regexTemplates.video.coub.regex.test(string);
        var vine    = regexTemplates.video.vine.regex.test(string);

        if (image) {

            pasteTool.callbacks.uploadImage(string);

        } else if (instagram) {

            pasteTool.callbacks.instagramMedia(instagram);

        } else if (twitter) {

            pasteTool.callbacks.twitterMedia(twitter);

        } else if (facebook) {

            pasteTool.callbacks.facebookMedia(string);

        } else if (vk) {

            pasteTool.callbacks.vkMedia(string);

        } else if (youtube) {

            pasteTool.callbacks.youtubeMedia(string);

        } else if (vimeo) {


        } else if (vine) {


        } else if (coub) {


        }

    },

    /**
     * Direct upload
     * @param url
     */
    uploadImage : function(path) {

        var ajaxUrl = location.protocol + '//' + location.hostname + ':32769',
            file,
            image,
            current = codex.content.currentNode,
            beforeSend,
            success_callback;

        /** When image is uploaded to redactors folder */
        success_callback = function(data) {

            console.log(data);
            return;
            var file = JSON.parse(data);
            image = pasteTool.ui.uploadedImage(file.filename);
            codex.content.switchBlock(current, image, 'image');

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
     * callback for youtube url's
     * Using iframe to render
     * @uses video tool
     * @param url
     */
    youtubeMedia : function(url) {
        var data = {
            video_url: url
        };

        codex.tools.video.make(data, true);
    },

    /**
     * callback for tweets
     * Using Twittter Widget to render
     * @uses Twitter tool
     * @param url
     */
    twitterMedia : function(url) {

        var fullUrl = url.input,
            tweetId,
            arr,
            data;

        arr = fullUrl.split('/');
        tweetId = arr.pop();

        /** Example */
        data = {
            media:true,
            conversation:false,
            user:{
                profile_image_url:"http:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
                profile_image_url_https:"https:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
                screen_name:"Niketas",
                name:"Никита Лихачёв"
            },
            id: tweetId,
            text:"ВНИМАНИЕ ЧИТАТЬ ВСЕМ НЕ ДАЙ БОГ ПРОПУСТИТЕ НУ ИЛИ ХОТЯ БЫ КЛИКНИ И ПОДОЖДИ 15 СЕКУНД https:\/\/t.co\/iWyOHf4xr2",
            created_at:"Tue Jun 28 14:09:12 +0000 2016",
            status_url:"https:\/\/twitter.com\/Niketas\/status\/747793978511101953",
            caption:"Caption"
        };

        codex.tools.twitter.make(data);
    }

};
