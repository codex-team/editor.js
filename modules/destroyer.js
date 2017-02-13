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
     * Delete editor data from webpage.
     * You should send settings argument with boolean flags:
     * {
     *      UI- remove redactor event listeners and DOM nodes
     *      scripts - remove redactor scripts from DOM
     *      plugins - remove plugin's objects
     *      core - remove editor core. You can remove core only if UI and scripts flags is true
     * }
     *
     */
    destroyer.destroy = function (settings) {

        if (settings.UI) {

            destroyer.removeNodes();
            editor.listeners.removeAll();

        }

        if (settings.scripts) {

            destroyer.destroyScripts();

        }

        if (settings.plugins) {

            destroyer.destroyPlugins();

        }

        if (settings.UI && settings.scripts && settings.core) {

            delete codex.editor;

        }

    };

    return destroyer;

}({});