/**
* CodeX Editor
* https://ifmo.su/editor
* @author CodeX team team@ifmo.su
*/
var cEditor = (function (cEditor) {

    // Default settings
    cEditor.settings = {
        tools : ['header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
        textareaId : 'codex-editor'
    };

    // Static nodes
    cEditor.nodes = {
        textarea : null,
        editor   : null,
        toolbar  : null
    }

    /**
    * Initialization
    * @uses Promise cEditor.core.prepare
    * @param {} userSettings are :
    *          - tools [],
    *          - textareaId String
    *          ...
    */
    cEditor.start = function (userSettings) {

        // Prepare editor settings
        this.core.prepare(userSettings)

            // If all ok, make UI, parse content and bind events
            .then(this.ui.make)
            .then(this.ui.bindEvents)
            .catch(function (error) {
                cEditor.core.log('Initialization failed with error: %o', 'warn', error);
            })

    };

    return cEditor;

})({});


/**
* Redactor core methods
* Methods:
*   - init
*   - log
*   - el
*/
cEditor.core = {

    /**
    * Editor preparing method
    * @return Promise
    */
    prepare : function (userSettings) {

        return new Promise(function(resolve, reject){

            if ( userSettings ) {

                cEditor.settings.tools = userSettings.tools || cEditor.settings.tools;

            }

            cEditor.nodes.textarea = document.getElementById(userSettings.textareaId || cEditor.settings.textareaId);

            if (typeof cEditor.nodes.textarea == undefined || cEditor.nodes.textarea == null) {
                reject(Error("Textarea wasn't found by ID: #" + userSettings.textareaId));
            } else {
                resolve();
            }

        });

    },

    /**
    * Logging method
    * @param type = ['log', 'info', 'warn']
    */
    log : function (msg, type, arg) {

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
    },

    /**
    * Returns element by selector
    * @todo Not using now. Check for necessity
    */
    el : function (selector, parent) {

        var el = null;

        parent = parent || document;

        if ( selector.substring(0,1) == '#' ){
            el = parent.getElementById(selector.substring(1));
            if ( typeof el != undefined )
                return el;
        } else {
            el = parent.querySelectorAll(selector);
            if ( el.length !== 0 )
                return el;
        }

        return el;
    }

}

cEditor.ui = {

    /**
    * Making main interface
    */
    make : function () {

        cEditor.core.log('ui.make fired', 'info');

        // Making toolbar ...

        // Making 'plus' button ...

    },

    /**
    * Parses input string to HTML editor content
    */
    parseContent : function () {

        cEditor.core.log('ui.parseContent fired', 'info');

    },

    /**
    * Bind editor UI events
    */
    bindEvents : function () {

        cEditor.core.log('ui.bindEvents fired', 'info');

    }

}