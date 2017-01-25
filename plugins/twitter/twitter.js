/**
 * Twitter plugin
 * @version 1.0.0
 */

var twitterTool = {

    /**
     * Prepare twitter scripts
     */
    prepare : function() {

        var script = "//platform.twitter.com/widgets.js";

        /**
         * Load script
         */
        codex.core.importScript(script, 'twitterAPI');

    },

    make : function(data) {

        if (!data.id || !data.status_url)
            return;

        if (!data.id_str && typeof(data.id) === 'number') {
            data.id_str = data.status_url.match(/[^\/]+$/)[0];
        }

        var blockContent = twitterTool.content.twitterBlock();

        twitterTool.content.twitter(data, blockContent);

        return blockContent;
    },

    save : function(blockContent) {

        var data;

        /**
         * Get caption
         */
        var nodeWithCaption = blockContent.querySelector('.twitter-tweet__caption');

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
            caption: nodeWithCaption.innerHTML
        };

        return data;

    },

    render : function(data) {
        return twitterTool.make(data);
    },

    /**
     * callback for tweets
     * Using Twittter Widget to render
     * @uses Twitter tool
     * @param url
     */
    urlPastedCallback : function(url) {

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
    }

};

twitterTool.content = {

    /**
     * Twitter render method appends content after block
     * @param tweetId
     */
    twitter : function(data, tweet) {

        setTimeout(function() {
            if ( window.twttr.widgets ){
                window.twttr.widgets.createTweet(data.id_str, tweet);
            }

        }, 1000);

        setTimeout(function() {

            var caption = document.createElement('DIV');
            caption.contentEditable = true;
            caption.classList.add('twitter-tweet__caption');
            caption.setAttribute('data-placeholder', 'Подпись');

            if (data.caption) {
                caption.innerHTML = data.caption;
            }
            tweet.appendChild(caption);

        }, 1100);

        tweet.classList.add('twitter__loader');

        if (codex.content.currentNode) {
            tweet.dataset.statusUrl = data.status_url;
            codex.content.switchBlock(codex.content.currentNode, tweet, 'tweet');
        }

        /**
         * in case if we need extra data
         */
        if (!data.user) {

            codex.core.ajax({
                url : '/writing/tweetInfo?tweetId=' + data.id_str,
                type: "GET",
                success: function(result) {
                    twitterTool.content.saveTwitterData(result, tweet);
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
