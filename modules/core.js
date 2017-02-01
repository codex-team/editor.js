/**
 * Codex Editor Core
 *
 * @author Codex Team
 * @version 1.1.2
 */

var core = (function(core) {

    /**
     * @public
     *
     * Editor preparing method
     * @return Promise
     */
    core.prepare = function (userSettings) {

        return new Promise(function(resolve, reject) {

            if ( userSettings ){

                codex.settings.tools = userSettings.tools || codex.settings.tools;

            }

            if (userSettings.data) {
                codex.state.blocks = userSettings.data;
            }

            if (userSettings.initialBlockPlugin) {
                codex.settings.initialBlockPlugin = userSettings.initialBlockPlugin;
            }

            if (userSettings.uploadImagesUrl) {
                codex.settings.uploadImagesUrl = userSettings.uploadImagesUrl;
            }

            codex.nodes.textarea = document.getElementById(userSettings.textareaId || codex.settings.textareaId);

            if (typeof codex.nodes.textarea === undefined || codex.nodes.textarea === null) {
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
            if ( 'console' in window && console[ type ] ){
                if ( arg ) console[ type ]( msg , arg );
                else console[ type ]( msg );
            }

        }catch(e){}

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
     * Native Ajax
     */
    core.ajax = function (data) {

        if (!data || !data.url){
            return;
        }

        var XMLHTTP          = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
            success_function = function(){},
            params = '',
            obj;

        data.async           = true;
        data.type            = data.type || 'GET';
        data.data            = data.data || '';
        data['content-type'] = data['content-type'] || 'application/json; charset=utf-8';
        success_function     = data.success || success_function ;

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
        XMLHTTP.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        XMLHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        XMLHTTP.onreadystatechange = function() {
            if (XMLHTTP.readyState == 4 && XMLHTTP.status == 200) {
                success_function(XMLHTTP.responseText);
            }
        };

        XMLHTTP.send(params);
    };

    /**
    * Appends script to head of document
    * @return Promise
    */
    core.importScript = function(scriptPath, instanceName) {

        return new Promise(function(resolve, reject){

            const instancePrefix = 'cdx-script-';

            let script;

            /** Script is already loaded */
            if ( !instanceName ){
                reject('Instance name is missed');
            } else if ( document.getElementById(instancePrefix + instanceName) ) {
                resolve(scriptPath);
            }

            script = document.createElement('SCRIPT');
            script.async = true;
            script.defer = true;
            script.id = instancePrefix + instanceName;

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

module.exports = core;


