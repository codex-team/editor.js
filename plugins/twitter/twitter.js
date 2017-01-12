/**
 * Twitter plugin
 * @version 1.0.0
 */

var twitter = (function(twitter) {

    var methods = {

        /**
         * Twitter render method appends content after block
         * @param tweetId
         */
        twitter : function(data, tweet) {

            setTimeout(function() {
                window.twttr.widgets.createTweet(data.id_str, tweet);
            }, 1000);

            tweet.classList.add('twitter__loader');

            if (codex.content.currentNode) {
                tweet.dataset.statusUrl = data.status_url;
                codex.content.switchBlock(codex.content.currentNode, tweet, 'twitter');
            }

            /**
             * in case if we need extra data
             */
            if (!data.user) {

                codex.core.ajax({
                    url : '/writing/tweetInfo?tweetId=' + data.id_str,
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
                tweet.dataset.id = data.id;
                tweet.dataset.idStr = data.id_str;
                tweet.dataset.text = data.text;
                tweet.dataset.createdAt = data.created_at;
                tweet.dataset.statusUrl = data.status_url;
                tweet.dataset.media = data.media;

                tweet.classList.remove('twitter__loader');

            }

        },

        twitterBlock : function() {
            var block = codex.draw.node('DIV', '', { height: "20px" });
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
                twitterContent.dataset.id = data.id;
                twitterContent.dataset.idStr = data.id_str;
                twitterContent.dataset.text = data.text;
                twitterContent.dataset.createdAt = data.created_at;
                twitterContent.dataset.media = data.entities.urls.length > 0 ? "false" : "true";

                twitterContent.classList.remove('twitter__loader');

            }, 50);

        }
    };

    /**
     * Prepare twitter scripts
     */
    twitter.prepare = function() {

        var script = "//platform.twitter.com/widgets.js";

        /**
         * Load script
         */
        codex.core.importScript(script, 'twitterAPI');

    };

    twitter.make = function(data) {

        if (!data.id || !data.status_url)
            return;

        if (!data.id_str && typeof(data.id) === 'number') {
            data.id_str = data.status_url.match(/[^\/]+$/)[0];
        }

        var blockContent = methods.twitterBlock();

        methods.twitter(data, blockContent);

        return blockContent;
    };

    twitter.validate = function(data) {
        return true;
    };

    twitter.save = function(blockContent) {

        var data;

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
            caption: ""
        };

        return data;
    };

    twitter.render = function(data) {
        return twitter.make(data);
    };

    return twitter;

})({});





