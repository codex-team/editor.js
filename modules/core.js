/**
 * Codex Editor Core
 *
 * @author Codex Team
 * @version 1.1.3
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

            if (userSettings.sanitizer) {

                editor.settings.sanitizer = userSettings.sanitizer;

            }

            editor.hideToolbar = userSettings.hideToolbar;

            editor.nodes.holder = document.getElementById(userSettings.holderId || editor.settings.holderId);

            if (typeof editor.nodes.holder === undefined || editor.nodes.holder === null) {

                reject(Error("Holder wasn't found by ID: #" + userSettings.holderId));

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
    core.ajax = function (settings) {

        if (!settings || !settings.url) {

            return;

        }

        var XMLHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
            encodedString,
            isFormData,
            prop;


        settings.async           = true;
        settings.type            = settings.type || 'GET';
        settings.data            = settings.data || '';
        settings['content-type'] = settings['content-type'] || 'application/json; charset=utf-8';

        if (settings.type == 'GET' && settings.data) {

            settings.url = /\?/.test(settings.url) ? settings.url + '&' + settings.data : settings.url + '?' + settings.data;

        } else {

            encodedString = '';
            for(prop in settings.data) {

                encodedString += (prop + '=' + encodeURIComponent(settings.data[prop]) + '&');

            }

        }

        if (settings.withCredentials) {

            XMLHTTP.withCredentials = true;

        }

        if (settings.beforeSend && typeof settings.beforeSend == 'function') {

            if (settings.beforeSend() === false) {

                return;

            }

        }

        XMLHTTP.open( settings.type, settings.url, settings.async );

        /**
         * If we send FormData, we need no content-type header
         */
        isFormData = isFormData_(settings.data);

        if (!isFormData) {

            if (settings.type != 'POST') {

                XMLHTTP.setRequestHeader('Content-type', settings['content-type']);

            } else {

                XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            }

        }

        XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (typeof settings.progress == 'function') {

            XMLHTTP.upload.onprogress = settings.progress;

        }

        XMLHTTP.onreadystatechange = function () {

            if (XMLHTTP.readyState == 4) {

                if (XMLHTTP.status == 200) {

                    if (typeof settings.success == 'function') {

                        settings.success(XMLHTTP.responseText);

                    }

                } else {

                    if (typeof settings.error == 'function') {

                        settings.error(XMLHTTP.responseText);

                    }

                }

            }

        };

        if (isFormData) {

            // Sending FormData
            XMLHTTP.send(settings.data);

        } else {

            // POST requests
            XMLHTTP.send(encodedString);

        }

        return XMLHTTP;

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

    /**
     * Function for checking is it FormData object to send.
     * @param {Object} object to check
     * @return boolean
     */
    var isFormData_ = function (object) {

        return object instanceof FormData;

    };

    return core;

})({});
