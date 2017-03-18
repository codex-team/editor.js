/**
 * Attache-file Plugin for CodeX Editor
 *
 * @param {String}  config.fetchUrl  - Route for file uploding
 * @param {Nubmer}  config.maxSize   - Maximum allowed file size in KB
 * @param {String}  config.accept    - Accepted MIME-types. By default, accepts all
 *
 * @author @gohabereg
 * @version 1.0.0
 */
var cdxAttaches = function () {

    /**
     * Private methods and props
     */

    var editor = codex.editor;

    var KBYTE = 1024;

    /**
     * Default config
     * Can be redefined with prepare method
     *
     * @var sting  config.fetchUrl -- url to your fetch script
     * @var int    config.maxSize  -- max size of file in kilobytes
     * @var accept config.accept   -- valid MIME-types. By default, accepts all
     *
     */
    var config = {

        fetchUrl: '',
        maxSize: 2,
        accept: ''

    };

    var elementsClasses = {

        defaultFormWrapper : 'cdx-attaches__default-wrapper',
        defaultFormButton  : 'cdx-attaches__default-button',
        progressBar        : 'cdx-attaches__progress-bar',
        wrapper            : 'cdx-attaches__files-wrapper',
        loader             : 'cdx-attaches__loader',
        crossButton        : 'cdx-attaches__cross-button',

        file: {
            name          : 'cdx-attaches__file-name',
            collapsedName : 'cdx-attaches__file-name--collapsed',
            extension     : 'cdx-attaches__file-extension',
            size          : 'cdx-attaches__file-size'
        }

    };

    var ui = {

        defaultForm: function () {

            var wrapper = editor.draw.node('div', elementsClasses.defaultFormWrapper),
                button = editor.draw.node('span', elementsClasses.defaultFormButton);

            button.addEventListener('click', upload.fire);
            button.innerHTML = '<i class="cdx-attaches__icon cdx-attaches__icon--inline"></i> Загрузить файл';

            wrapper.appendChild(button);

            return wrapper;

        },

        uploadedFile: function (data) {

            var wrapper   = editor.draw.node('div', elementsClasses.wrapper),
                name      = editor.draw.node('input', elementsClasses.file.name),
                extension = editor.draw.node('span', elementsClasses.file.extension),
                size      = editor.draw.node('span', elementsClasses.file.size);

            wrapper.dataset.url   = data.url;
            name.value            = data.name;
            extension.textContent = data.extension.toUpperCase();
            size.textContent      = data.size;

            wrapper.appendChild(name);
            wrapper.appendChild(extension);
            wrapper.appendChild(size);

            return wrapper;

        },

        progressBar: {

            bar: null,

            draw: function () {

                var wrapper     = editor.draw.node('div', elementsClasses.wrapper),
                    progress    = editor.draw.node('progress', elementsClasses.progressBar),
                    name        = editor.draw.node('span', elementsClasses.file.name),
                    crossButton = editor.draw.node('span', elementsClasses.crossButton);

                progress.max = 100;
                progress.value = 0;

                name.textContent = editor.transport.input.files[0].name;
                name.classList.add(elementsClasses.file.collapsedName);

                crossButton.addEventListener('click', upload.abort);

                ui.progressBar.bar = progress;

                wrapper.appendChild(name);
                wrapper.appendChild(progress);
                wrapper.appendChild(crossButton);

                return wrapper;

            },

            change: function (value) {

                console.assert( !isNaN(value), 'CodeX Editor Attaches: passed value is not a Number');

                ui.progressBar.bar.value = value;

            }

        }

    };

    /**
     * Notify about upload errors via codex.editor.notifications
     *
     * @param Object error can have `message` property with error message
     */
    var notifyError = function (error) {

        error = error || {};

        editor.notifications.notification({
            type: 'error',
            message: 'Ошибка во время загрузки файла' + ( error.message ? ': ' + error.message : '' )
        });

    };

    /**
     * Contains validation methods
     *
     * TODO: MIME-type validation
     *
     */
    var validation = {

        size: function () {

            var file = editor.transport.input.files[0];

            return Math.ceil(file.size / KBYTE) <= config.maxSize;

        },

    };

    var upload = {

        current: null,

        aborted: true,

        /**
         * Fired codex.editor.transport selectAndUpload methods
         */
        fire: function () {

            editor.transport.selectAndUpload({
                url: config.fetchUrl,
                success: upload.success,
                beforeSend: upload.start,
                progress: upload.progress,
                error: upload.error,
                accept: config.accept
            });

        },

        /**
         * Will be called before upload
         * Draws load animation and progress bar
         */
        start:  function () {

            if (!validation.size()) {

                notifyError({message: 'Файл слишком большой'});
                return false;

            }

            var progress = ui.progressBar.draw();

            upload.current = progress;

            editor.content.switchBlock(editor.content.currentNode, progress);

        },

        /**
         * Handler for XmlHttpRequest.upload.onprogress event
         * Changes progress bar status
         *
         * @param event
         */
        progress: function (event) {

            /** Prevents isNaN value assignment */
            if (!event.total) {
                return;
            }

            var value = parseInt(event.loaded / event.total * 100);

            ui.progressBar.change(value);

        },

        /**
         * Will be called after success upload
         * Try to decode JSON response and draws ui or fires error handler
         *
         * @param response
         */
        success: function (response) {

            var data,
                uploadedFile;

            try {

                response = JSON.parse(response);

                if (response.status == 'success') {

                    data = response.data;
                    data.size = Math.ceil(data.size / KBYTE) || 1;

                    uploadedFile = ui.uploadedFile(data);
                    editor.content.switchBlock(upload.current, uploadedFile);

                    uploadedFile.querySelector('input').focus();

                } else {

                    upload.error(response);

                }

            } catch (e) {

                upload.error();

            }

        },

        /**
         * Upload errors handler
         *
         * @param error
         */
        error: function (error) {

            var defaultFrom = ui.defaultForm();

            editor.content.switchBlock(upload.current, defaultFrom);

            if (!upload.aborted) {

                notifyError(error);

            }

            upload.aborted = false;

        },

        abort: function () {

            editor.transport.abort();

            upload.aborted = true;

        }

    };



   /*
   * Public methods
   * @param {String} _config.fetchUrl Required
   */
    var prepare = function (_config) {

        return new Promise(function(resolve, reject){

            if ( !_config.fetchUrl ){

                reject(Error('fetchUrl is missed'));
                return;

            }

            config.fetchUrl = _config.fetchUrl;
            config.accept   = _config.accept || config.accept;

            if ( !isNaN(_config.maxSize)){
                config.maxSize  = _config.maxSize;
            }

            resolve();

        });

    };

    var render = function (data) {

        if (!data) {

            return ui.defaultForm();

        }

        return ui.uploadedFile(data);

    };

    var save = function (block) {

        var data = {

            url: block.dataset.url,
            name: block.querySelector('.' + elementsClasses.file.name).value,
            extension: block.querySelector('.' + elementsClasses.file.extension).textContent,
            size: block.querySelector('.' + elementsClasses.file.size).textContent,

        };

        return data;

    };

    var validate = function (data) {

        if (!data.url || !data.url.trim()) {

            return false;

        }

        if (!data.name || !data.name.trim()) {

            return false;

        }

        if (!data.extension || !data.extension.trim()) {

            return false;

        }

        if (!data.size || !data.size.trim()) {

            return false;

        }

        return true;

    };

    var destroy = function () {

        cdxAttaches = null;

    };

    var appendCallback = function () {

        upload.fire();

    };

    return {
        prepare: prepare,
        render: render,
        save: save,
        validate: validate,
        destroy: destroy,
        appendCallback: appendCallback
    };

}();