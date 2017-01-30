/**
 * Twitter plugin
 * @version 1.0.0
 */

var twitter = (function(twitter) {

    /**
    * CSS classes
    */
    var css_ = {
        pluginWrapper : 'cdx-tweet'
    };

    var methods = {

        /**
         * Twitter render method appends content after block
         * @param tweetId
         */
        twitter : function(data, twitterBlock) {

            var tweet = methods.drawTwitterHolder(),
                twittersCaption = methods.drawTwittersCaptionBlock();

            if (data.caption) {
                twittersCaption.innerHTML = data.caption;
            }

            /**
             * add created tweet to holder
             */
            tweet.appendChild(twitterBlock);

            // setTimeout(function() {
                window.twttr.widgets.createTweet(data.id_str, twitterBlock).then(tweetInsertedCallback_);
            // }, 1000);

            tweet.classList.add('ce-redactor__loader');

            if (codex.content.currentNode) {
                tweet.dataset.statusUrl = data.status_url;
                codex.content.switchBlock(codex.content.currentNode, tweet, 'tweet');
            }

            /**
             * in case if we need extra data
             */
            if ( !data.user ) {

                codex.core.ajax({
                    url : twitter.config.fetchUrl + '?tweetId=' + data.id_str,
                    type: "GET",
                    success: function(result) {
                        methods.saveTwitterData(result, tweet);
                    }
                });

            } else {

                tweet.dataset.profileImageUrl = data.user.profile_image_url;
                tweet.dataset.profileImageUrlHttps = data.user.profile_image_url_https;
                tweet.dataset.screenName = data.user.screen_name;
                tweet.dataset.name = data.user.name;
                tweet.dataset.id = +data.id;
                tweet.dataset.idStr = data.id_str;
                tweet.dataset.text = data.text;
                tweet.dataset.createdAt = data.created_at;
                tweet.dataset.statusUrl = data.status_url;
                tweet.dataset.media = data.media;

                tweet.classList.remove('ce-redactor__loader');
            }

            /**
             * add caption to tweet
             */
            setTimeout(function() {
                tweet.appendChild(twittersCaption);
            }, 1000);

            return tweet;

        },

        drawTwitterHolder : function() {

            var block = document.createElement('DIV');

            block.classList.add(css_.pluginWrapper);

            return block;

        },

        drawTwitterBlock : function() {
            var block = codex.draw.node('DIV', '', { height: "20px" });
            return block;
        },

        drawTwittersCaptionBlock : function() {
            var block = codex.draw.node('DIV', ['ce-twitter__caption'], { contentEditable : true });
            return block;
        },

        saveTwitterData : function(result, tweet) {

            var data = JSON.parse(result),
                twitterContent = tweet;

            setTimeout(function() {

                /**
                 * Save twitter data via data-attributes
                 */
                twitterContent.dataset.profileImageUrl = data.user.profile_image_url;
                twitterContent.dataset.profileImageUrlHttps = data.user.profile_image_url_https;
                twitterContent.dataset.screenName = data.user.screen_name;
                twitterContent.dataset.name = data.user.name;
                twitterContent.dataset.id = +data.id;
                twitterContent.dataset.idStr = data.id_str;
                twitterContent.dataset.text = data.text;
                twitterContent.dataset.createdAt = data.created_at;
                twitterContent.dataset.media = data.entities.urls.length > 0 ? "false" : "true";

            }, 50);

        }
    };

    /**
    * @private
    * Fires after tweet widget rendered
    */
    function tweetInsertedCallback_(widget) {

        var pluginWrapper = findParent_( widget , css_.pluginWrapper );

        pluginWrapper.classList.remove('ce-redactor__loader');

    }

    /**
    * @private
    * Find closiest parent Element with CSS class
    */
    function findParent_ (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    /**
     * Prepare twitter scripts
     */
    twitter.prepare = function(config) {

        var script = "https://platform.twitter.com/widgets.js";

        /**
         * Save configs
         */
        twitter.config = config;

        /**
         * Load script
         */
        codex.core.importScript(script, 'twitterAPI');

    };

    /**
     * @private
     *
     * @param data
     * @returns {*}
     */
    make_ = function(data) {

        if (!data.id || !data.status_url)
            return;

        if (!data.id_str) {
            data.id_str = data.status_url.match(/[^\/]+$/)[0];
        }

        var twitterBlock   = methods.drawTwitterBlock();

        var tweet = methods.twitter(data, twitterBlock);

        return tweet;
    };

    twitter.validate = function(data) {
        return true;
    };

    twitter.save = function(blockContent) {

        var data,
            caption = blockContent.querySelector('.ce-twitter__caption');

        data = {
            media:blockContent.dataset.media,
            conversation:false,
            user:{
                profile_image_url: blockContent.dataset.profileImageUrl,
                profile_image_url_https: blockContent.dataset.profileImageUrlHttps,
                screen_name: blockContent.dataset.screenName,
                name: blockContent.dataset.name
            },
            id: blockContent.dataset.id || blockContent.dataset.tweetId,
            id_str : blockContent.dataset.idStr,
            text: blockContent.dataset.text,
            created_at: blockContent.dataset.createdAt,
            status_url: blockContent.dataset.statusUrl,
            caption: caption.innerHTML
        };

        return data;
    };

    twitter.render = function(data) {
        return make_(data);
    };

    twitter.urlPastedCallback = function(url) {

        var tweetId,
            arr,
            data;

        arr = url.split('/');
        tweetId = arr.pop();

        /** Example */
        data = {
            "media" : true,
            "conversation" : false,
            "user" : null,
            "id" : +tweetId,
            "text" : null,
            "created_at" : null,
            "status_url" : url,
            "caption" : null
        };

        make_(data);
    };

    return twitter;

})({});





