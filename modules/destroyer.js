/**
 * Codex Editor Destroyer module
 *
 * @auhor Codex Team
 * @version 1.0
 */

module.exports = function (destroyer) {

    let editor = codex.editor;

    destroyer.removeNodes = function () {

        editor.nodes.wrapper.remove();
        editor.nodes.notifications.remove();

    };

    destroyer.destroyPlugins = function () {

        for (var tool in editor.tools) {

            if (typeof editor.tools[tool].destroy === 'function') {

                editor.tools[tool].destroy();

            }

        }

    };

    destroyer.destroyScripts = function () {

        var scripts = document.getElementsByTagName('SCRIPT');

        for (var i = 0; i < scripts.length; i++) {

            if (scripts[i].id.indexOf(editor.scriptPrefix) + 1) {

                scripts[i].remove();
                i--;

            }

        }

    };

    /**
     * Delete all editor data from webpage:
     *
     * 1. Remove all listeners that was added by editor
     * 2. Calls plugins destroy method to remove plugins from storage
     * 3. Remove editor elements from DOM
     * 4. Remove scripts with editor prefix
     * 4. Delete editor object from storage
     *
     */
    destroyer.destroy = function () {

        editor.listeners.removeAll();

        destroyer.destroyPlugins();

        destroyer.removeNodes();

        destroyer.destroyScripts();

        delete codex.editor;

    };

    return destroyer;

}({});