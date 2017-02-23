/**
* Plugin for CodeX.Editor
* Implements RAW-data block
*/
var rawPlugin = function (plugin) {

    var editor = codex.editor;

    plugin.render = function (data) {

        var input   = editor.draw.node('TEXTAREA', 'raw-plugin__input', {});

        input.placeholder = 'Вставьте HTML код';

        if (data && data.html) {
            input.value = data.html;
        }

        return input;

    };

    plugin.save = function (block) {

        return {
            html: block.value
        };

    };

    plugin.validate = function (data) {

        if (data.html.trim() === '') {

            return;

        }

        return true;

    };

    plugin.destroy = function () {

        rawPlugin = null;

    };

    return plugin;

}({});