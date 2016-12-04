var codex = require('../editor');

var tools = (function(tools) {

    tools.init = function() {

        tools.paragraph = require('./plugins/paragraph/paragraph');
        tools.header    = require('./plugins/header/header');
        tools.code      = require('./plugins/code/code');
        tools.link      = require('./plugins/link/link');
        tools.list      = require('./plugins/list/list');
        tools.quote     = require('./plugins/quote/quote');
        tools.image     = require('./plugins/image/image');
        tools.instagram = require('./plugins/instagram/instagram');
        tools.twitter   = require('./plugins/twitter/twitter');
        tools.paste     = require('./plugins/paste/paste');

    };

    return tools;

})({});

tools.init();

codex.tools = tools;
module.exports = tools;
