/**
 * Redactor core methods
 * @author Codex team
 * @version 1.0.0
 *
 *
 * Methods:
 *   - init
 *   - log
 *   - insertAfter
 *   - isDomNode
 */

var core = (function() {

    /**
     * @protected
     *
     * Editor preparing method
     * @return Promise
     */
    var prepare = function (userSettings) {

        return new Promise(function(resolve, reject) {

            if ( userSettings ) {

                cEditor.settings.tools = userSettings.tools || cEditor.settings.tools;

            }

            if (userSettings.data) {
                cEditor.state.blocks = userSettings.data;
            }

            cEditor.nodes.textarea = document.getElementById(userSettings.textareaId || cEditor.settings.textareaId);

            if (typeof cEditor.nodes.textarea === undefined || cEditor.nodes.textarea === null) {
                reject(Error("Textarea wasn't found by ID: #" + userSettings.textareaId));
            } else {
                resolve();
            }

        });

    };

    /**
     * @protected
     *
     * Logging method
     * @param type = ['log', 'info', 'warn']
     */
    var log = function (msg, type, arg) {

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
    var insertAfter = function (target, element) {
        target.parentNode.insertBefore(element, target.nextSibling);
    };

    /**
     * @const
     * Readable DOM-node types map
     */
    var nodeTypes = {
        TAG     : 1,
        TEXT    : 3,
        COMMENT : 8
    };

    /**
     * @const
     * Readable keys map
     */
    var keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 };

    /**
     * @protected
     * Check object for DOM node
     */
    var isDomNode = function (el) {
        return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
    };


    return {
        prepare     : prepare,
        log         : log,
        insertAfter : insertAfter,
        nodeTypes   : nodeTypes,
        keys        : keys,
        isDomNode   : isDomNode
    };

})();

module.exports = core;