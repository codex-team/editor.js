var raw = function (plugin) {

    var editor = codex.editor;

    plugin.render = function (data) {

        var input   = editor.draw.node('DIV', 'raw-plugin__input', {contentEditable: true});

        if (data && data.html) {
            input.textContent = data.html;
        }

        return input;

    };

    plugin.save = function (block) {

        return {
            html: block.textContent
        }

    };

    plugin.validate = function (data) {

        if (data.html.trim() === '') {

            return;

        }

        return true;

    };

    plugin.destroy = function () {

        raw = null;

    };

    return plugin;

}({});