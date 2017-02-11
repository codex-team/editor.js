/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */

var code = (function(code_plugin) {

    var baseClass = "ce-code";

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    var make_ = function (data) {

        var tag = codex.editor.draw.node('CODE', [baseClass], {});

        if (data && data.text) {
            tag.innerHTML = data.text;
        }

        tag.contentEditable = true;

        return tag;
    };

    /**
     * Method to render HTML block from JSON
     */
    code_plugin.render = function (data) {

        return make_(data);
    };

    /**
     * Method to extract JSON data from HTML block
     */
    code_plugin.save = function (blockContent) {

        var data = {
            text : blockContent.innerHTML
        };
        return data;

    };

    code_plugin.validate = function (data) {

        if (data.text.trim() == '')
            return;

        return true;
    };

    code_plugin.destroy = function () {

        code = null;
        delete window.code;

    };

    return code_plugin;

})({});
