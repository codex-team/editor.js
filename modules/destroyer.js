module.exports = function (destroyer) {

    let editor = codex.editor;

    destroyer.removeNodes = function () {

        editor.nodes.wrapper.remove();
        editor.nodes.notifications.remove();

    };

    destroyer.destroy = function () {

        editor.listeners.removeAll();

        destroyer.removeNodes();

        delete codex.editor;

    };

    return destroyer;

}({});