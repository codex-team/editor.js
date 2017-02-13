/**
 *
 * Codex.Editor Transport Module
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function (transport) {

    let editor = codex.editor;

    transport.input = null;

    /**
     * @property {Object} arguments - keep plugin settings and defined callbacks
     */
    transport.arguments = null;

    transport.prepare = function () {

        var input = document.createElement('INPUT');

        input.type = 'file';
        editor.listeners.add(input, 'change', editor.transport.fileSelected);

        editor.transport.input = input;

    };

    /** Clear input when files is uploaded */
    transport.clearInput = function () {

        /** Remove old input */
        this.input = null;

        /** Prepare new one */
        this.prepare();

    };

    /**
     * Callback for file selection
     * @param {Event} event
     */
    transport.fileSelected = function () {

        var input       = this,
            files       = input.files,
            formdData   = new FormData();

        formdData.append('files', files[0], files[0].name);

        editor.transport.ajax({
            data : formdData,
            beforeSend : editor.transport.arguments.beforeSend,
            success    : editor.transport.arguments.success,
            error      : editor.transport.arguments.error
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
     * @todo use core.ajax
     */
    transport.ajax = function (params) {

        var xhr = new XMLHttpRequest(),
            beforeSend = typeof params.beforeSend == 'function' ? params.beforeSend : function () {},
            success    = typeof params.success    == 'function' ? params.success : function () {},
            error      = typeof params.error      == 'function' ? params.error   : function () {};

        beforeSend();

        xhr.open('POST', editor.settings.uploadImagesUrl, true);

        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.onload = function () {

            if (xhr.status === 200) {

                success(xhr.responseText);

            } else {

                editor.core.log('request error: %o', xhr);
                error();

            }

        };

        xhr.send(params.data);
        this.clearInput();

    };

    return transport;

})({});