/**
 * Codex Editor Core
 *
 * @author Codex Team
 * @version 1.1.2
 */

module.exports = (function (core) {

    let editor = codex.editor;

    /**
     * @public
     *
     * Editor preparing method
     * @return Promise
     */
    core.prepare = function (userSettings) {

        return new Promise(function (resolve, reject) {

            if ( userSettings ) {

                editor.settings.tools = userSettings.tools || editor.settings.tools;

            }

            if (userSettings.data) {

                editor.state.blocks = userSettings.data;

            }

            if (userSettings.initialBlockPlugin) {

                editor.settings.initialBlockPlugin = userSettings.initialBlockPlugin;

            }

            if (userSettings.uploadImagesUrl) {

                editor.settings.uploadImagesUrl = userSettings.uploadImagesUrl;

            }

            editor.nodes.textarea = document.getElementById(userSettings.textareaId || editor.settings.textareaId);

            if (typeof editor.nodes.textarea === undefined || editor.nodes.textarea === null) {

                reject(Error("Textarea wasn't found by ID: #" + userSettings.textareaId));

            } else {

                resolve();

            }

        });

    };

    /**
     * Logging method
     * @param type = ['log', 'info', 'warn']
     */
    core.log = function (msg, type, arg) {

        type = type || 'log';

        if (!arg) {

            arg  = msg || 'undefined';
            msg  = '[codex-editor]:      %o';

        } else {

            msg  = '[codex-editor]:      ' + msg;

        }

        try{

            if ( 'console' in window && window.console[ type ] ) {

                if ( arg ) window.console[ type ]( msg, arg );
                else window.console[ type ]( msg );

            }

        }catch(e) {}

    };

    /**
     * @protected
     *
     * Helper for insert one element after another
     */
    core.insertAfter = function (target, element) {

        target.parentNode.insertBefore(element, target.nextSibling);

    };

    /**
     * @const
     *
     * Readable DOM-node types map
     */
    core.nodeTypes = {
        TAG     : 1,
        TEXT    : 3,
        COMMENT : 8
    };

    /**
     * @const
     * Readable keys map
     */
    core.keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 };

    /**
     * @protected
     *
     * Check object for DOM node
     */
    core.isDomNode = function (el) {

        return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;

    };

    /**
    * Checks passed object for emptiness
    * @require ES5 - Object.keys
    * @param {object}
    */
    core.isEmpty = function ( obj ) {

        return Object.keys(obj).length === 0;

    };

    /**
     * Native Ajax
     */
    core.ajax = function (data) {

        if (!data || !data.url) {

            return;

        }

        var XMLHTTP          = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
            successFunction = function () {},
            params = '',
            obj;

        data.async           = true;
        data.type            = data.type || 'GET';
        data.data            = data.data || '';
        data['content-type'] = data['content-type'] || 'application/json; charset=utf-8';
        successFunction     = data.success || successFunction ;

        if (data.type == 'GET' && data.data) {

            data.url = /\?/.test(data.url) ? data.url + '&' + data.data : data.url + '?' + data.data;

        } else {

            for(obj in data.data) {

                params += (obj + '=' + encodeURIComponent(data.data[obj]) + '&');

            }

        }

        if (data.withCredentials) {

            XMLHTTP.withCredentials = true;

        }

        if (data.beforeSend && typeof data.beforeSend == 'function') {

            data.beforeSend.call();

        }

        XMLHTTP.open( data.type, data.url, data.async );
        XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        XMLHTTP.onreadystatechange = function () {

            if (XMLHTTP.readyState == 4 && XMLHTTP.status == 200) {

                successFunction(XMLHTTP.responseText);

            }

        };

        XMLHTTP.send(params);

    };

    /**
    * Appends script to head of document
    * @return Promise
    */
    core.importScript = function (scriptPath, instanceName) {

        return new Promise(function (resolve, reject) {

            let script;

            /** Script is already loaded */
            if ( !instanceName ) {

                reject('Instance name is missed');

            } else if ( document.getElementById(editor.scriptPrefix + instanceName) ) {

                resolve(scriptPath);

            }

            script = document.createElement('SCRIPT');
            script.async = true;
            script.defer = true;
            script.id = editor.scriptPrefix + instanceName;

            script.onload = function () {

                resolve(scriptPath);

            };

            script.onerror = function () {

                reject(scriptPath);

            };

            script.src = scriptPath;
            document.head.appendChild(script);

        });

    };

    return core;

})({});