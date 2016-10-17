/**
 * File transport module
 *
 * @author Codex team
 * @version 1.0.0
 */

var transport = (function() {

    var input = null;

    /**
     * @property {Object} arguments - keep plugin settings and defined callbacks
     */
    var arguments = null;

    /**
     * @protected
     *
     * draws input with file type
     */
    var prepare = function(){

        var input = document.createElement('INPUT');

        input.type = 'file';
        input.addEventListener('change', cEditor.transport.fileSelected);

        cEditor.transport.input = input;

    };

    /**
     * @private
     *
     * Clear input when files is uploaded
     */
    var clearInput = function() {

        /** Remove old input */
        this.input = null;

        /** Prepare new one */
        this.prepare();
    };

    /**
     * @protected
     *
     * Callback for file selection
     */
    var fileSelected = function(event){

        var input       = this,
            files       = input.files,
            filesLength = files.length,
            formdData   = new FormData(),
            file,
            i;

        formdData.append('files', files[0], files[0].name);

        cEditor.transport.ajax({
            data : formdData,
            beforeSend : cEditor.transport.arguments.beforeSend,
            success    : cEditor.transport.arguments.success,
            error      : cEditor.transport.arguments.error,
        });
    };

    /**
     * @protected
     *
     * Use plugin callbacks
     */
    var selectAndUpload = function (args) {

        this.arguments = args;
        this.input.click();

    };

    /**
     * @private
     *
     * Ajax requests module
     */
    var ajax = function(params){

        var xhr = new XMLHttpRequest(),
            beforeSend = typeof params.success == 'function' ? params.beforeSend : function(){},
            success    = typeof params.success == 'function' ? params.success : function(){},
            error      = typeof params.error   == 'function' ? params.error   : function(){};

        beforeSend();

        xhr.open('POST', cEditor.settings.uploadImagesUrl, true);

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

    return {
        input           : input,
        arguments       : arguments,
        prepare         : prepare,
        clearInput      : clearInput,
        fileSelected    : fileSelected,
        selectAndUpload : selectAndUpload,
        ajax            : ajax
    };

})();

module.exports = transport;