/**
 * Twitter plugin
 * @version 1.0.0
 */

var twitter = (function(twitter) {

    var content = {

        /**
         * Twitter render method appends content after block
         * @param tweetId
         */
        twitter : function(tweetId) {

            var tweet = twitterTool.content.twitterBlock();

            codex.content.switchBlock(codex.content.currentNode, tweet, 'twitter');

            var blockContent = codex.content.currentNode.childNodes[0];
            blockContent.classList.add('twitter__loader');

            window.twttr.widgets.createTweet(tweetId, blockContent);

            setTimeout(function() {
                blockContent.classList.remove('twitter__loader');
            }, 500);

            /** Remove empty DIV */
            blockContent.childNodes[0].remove();

        },

        twitterBlock : function() {
            var block = codex.draw.node('DIV', '', {});
            return block;
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

        if (!data.id)
            return;

        twitterTool.content.twitter(data.id);
    };

    twitter.validate = function(data) {

    };

    twitter.save = function(blockContent) {

        var data;

        data = {
            media:true,
            conversation:false,
            user:{
                profile_image_url:"http:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
                profile_image_url_https:"https:\/\/pbs.twimg.com\/profile_images\/1817165982\/nikita-likhachev-512_normal.jpg",
                screen_name:"Niketas",
                name:"Никита Лихачёв"
            },
            id: blockContent.dataset.tweetId,
            text:"ВНИМАНИЕ ЧИТАТЬ ВСЕМ НЕ ДАЙ БОГ ПРОПУСТИТЕ НУ ИЛИ ХОТЯ БЫ КЛИКНИ И ПОДОЖДИ 15 СЕКУНД https:\/\/t.co\/iWyOHf4xr2",
            created_at:"Tue Jun 28 14:09:12 +0000 2016",
            status_url:"https:\/\/twitter.com\/Niketas\/status\/747793978511101953",
            caption:"Caption"
        };

        return data;

    };

    twitter.render = function(data) {
        return twitter.make(data);
    };

    return twitter;

})({});


