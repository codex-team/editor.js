/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */

var code = (function(code_plugin) {

    var baseClass = "ce-code";


    var intendWatcher = function () {

        var keys = {
            brackets: {
                left: 219,
                right: 221
            },

            enter: 13
        };

        var intendation = {

            set: function (intend) {
                codex.editor.content.currentNode.dataset.intend = intend;
            },

            get: function () {
                return codex.editor.content.currentNode.dataset.intend || 0;
            }


        };

        var keyUp = function (e) {

            var intend = intendation.get();

            var key = e.keyCode;

            if (key == keys.brackets.left && e.shiftKey) {
                intend++;
            }

            if (key == keys.brackets.right && e.shiftKey) {
                intend--;
            }

            if (key == keys.enter) {

                for (var i = 0; i < intend; i++) {

                    codex.editor.caret.tabBehaviorEmulator(codex.editor.tools.code.tabBehavior);

                }

                console.log('enter: ',intend);

            }

            intendation.set(intend);

        };

        return {
            keyUp: keyUp
        };

    }();

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
        tag.addEventListener('keyup', intendWatcher.keyUp);

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

    };

    return code_plugin;

})({});
