var codex = require('../editor');

var transport = (function(transport){

    transport.init = function() {

    };

    transport.input = null;

    /**
     * @property {Object} arguments - keep plugin settings and defined callbacks
     */
    transport.arguments = null;

    transport.prepare = function(){

        var input = document.createElement('INPUT');

        input.type = 'file';
        input.addEventListener('change', codex.transport.fileSelected);

        codex.transport.input = input;

    };

    /** Clear input when files is uploaded */
    transport.clearInput = function() {

        /** Remove old input */
        this.input = null;

        /** Prepare new one */
        this.prepare();
    };

    /**
     * Callback for file selection
     */
    transport.fileSelected = function(event){

        var input       = this,
            files       = input.files,
            filesLength = files.length,
            formdData   = new FormData(),
            file,
            i;

        formdData.append('files', files[0], files[0].name);

        codex.transport.ajax({
            data : formdData,
            beforeSend : codex.transport.arguments.beforeSend,
            success    : codex.transport.arguments.success,
            error      : codex.transport.arguments.error
        });
    };

    /**
     * Use plugin callbacks
     * @protected
     */
    transport.selectAndUpload = function (args) {

        this.arguments = args;
        this.input.click();

    };

    /**
     * Ajax requests module
     */
    transport.ajax = function(params){

        var xhr = new XMLHttpRequest(),
            beforeSend = typeof params.beforeSend == 'function' ? params.beforeSend : function(){},
            success    = typeof params.success    == 'function' ? params.success : function(){},
            error      = typeof params.error      == 'function' ? params.error   : function(){};

        beforeSend();

        xhr.open('POST', codex.settings.uploadImagesUrl, true);

        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else {
                console.log("request error: %o", xhr);
                error();
            }
        };

        xhr.send(params.data);
        this.clearInput();

    };

    return transport;

})({});

transport.init();

codex.transport = transport;
module.exports  = transport;