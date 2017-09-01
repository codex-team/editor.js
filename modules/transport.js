/**
 *
 * Codex.Editor Transport Module
 *
 * @copyright 2017 Codex-Team
 * @version 1.2.0
 */

module.exports = (function () {
  let transport = {};

  let editor = this;


    /**
     * @private {Object} current XmlHttpRequest instance
     */
  var currentRequest = null;


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
    let input = editor.modules.draw.node( 'INPUT', '', { type : 'file' } );

    editor.modules.listeners.add(input, 'change', editor.modules.transport.fileSelected);
    editor.modules.transport.input = input;
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

    if (editor.modules.transport.arguments.multiple === true) {
      for ( i = 0; i < files.length; i++) {
        formData.append('files[]', files[i], files[i].name);
      }
    } else {
      formData.append('files', files[0], files[0].name);
    }

    currentRequest = editor.core.ajax({
      type : 'POST',
      data : formData,
      url        : editor.modules.transport.arguments.url,
      beforeSend : editor.modules.transport.arguments.beforeSend,
      success    : editor.modules.transport.arguments.success,
      error      : editor.modules.transport.arguments.error,
      progress   : editor.modules.transport.arguments.progress
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
     * @param {Function} args.progress - xhr onprogress handler
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

  transport.abort = function () {
    currentRequest.abort();

    currentRequest = null;
  };

  return transport;
});
