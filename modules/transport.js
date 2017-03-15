/**
 *
 * Codex.Editor Transport Module
 *
 * @copyright 2017 Codex-Team
 * @version 1.2.0
 */

module.exports = (function (transport) {

    let editor = codex.editor;

    /**
     * @type {null} | {DOMElement} input - keeps input element in memory
     */
    transport.input = null;

    /**
     * @property {Object} arguments - keep plugin settings and defined callbacks
     */
    transport.arguments = null;

    /**
     * Prepares input element where will be files
     */
    transport.prepare = function () {

        let input = editor.draw.node( 'INPUT', '', { type : 'file' } );

        editor.listeners.add(input, 'change', editor.transport.fileSelected);
        editor.transport.input = input;

    };

    /** Clear input when files is uploaded */
    transport.clearInput = function () {

        /** Remove old input */
        transport.input = null;

        /** Prepare new one */
        transport.prepare();

    };

    /**
     * Callback for file selection
     * @param {Event} event
     */
    transport.fileSelected = function () {

        var input       = this,
            i,
            files       = input.files,
            formData   = new FormData();

        if (editor.transport.arguments.multiple === false) {

            formData.append('files', files[0], files[0].name);

        } else {

            for ( i = 0; i < files.length; i++) {

                formData.append('files[]', files[i], files[i].name);

            }

        }

        editor.core.ajax({
            type : 'POST',
            data : formData,
            url        : editor.transport.arguments.url,
            beforeSend : editor.transport.arguments.beforeSend,
            success    : editor.transport.arguments.success,
            error      : editor.transport.arguments.error
        });

        /** Clear input */
        transport.clearInput();

    };

    /**
     * Use plugin callbacks
     * @protected
     *
     * @param {Object} args - can have :
     * @param {String} args.url - fetch URL
     * @param {Function} args.beforeSend - function calls before sending ajax
     * @param {Function} args.success - success callback
     * @param {Function} args.error - on error handler
     * @param {Boolean} args.multiple - allow select several files
     * @param {String} args.accept - adds accept attribute
     */
    transport.selectAndUpload = function (args) {

        transport.arguments = args;

        if ( args.multiple === true) {

            transport.input.setAttribute('multiple', 'multiple');

        }

        if ( args.accept ) {

            transport.input.setAttribute('accept', args.accept);

        }

        transport.input.click();

    };

    return transport;

})({});