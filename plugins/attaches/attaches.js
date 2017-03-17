var attachesPlugin = function () {

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
     * @var accept config.accept   -- valid MIME-types. For all MIME-types set value equal false
     *
     */
    var config = {

        fetchUrl: '/editor/attaches',
        maxSize: 2 * KBYTE,
        accept: ''

    };

    var elementsClasses = {

        defaultFormWrapper: 'attaches-plugin__default-wrapper',

        defaultFormButton: 'attaches-plugin__default-button',

        progressBar: 'attaches-plugin__progress-bar',

        wrapper: 'attaches-plugin__files-wrapper',

        loader: 'attaches-plugin__loader',

        crossButton: 'attaches-plugin__cross-button',

        file: {
            name          : 'attaches-plugin__file-name',
            collapsedName : 'attaches-plugin__file-name--collapsed',
            extension     : 'attaches-plugin__file-extension',
            size          : 'attaches-plugin__file-size'
        }

    };

    var ui = {

        defaultForm: function () {

            var wrapper = editor.draw.node('div', elementsClasses.defaultFormWrapper),
                button = editor.draw.node('span', elementsClasses.defaultFormButton);

            button.addEventListener('click', upload.fire);
            button.innerHTML = '<i class="attaches-plugin__icon attaches-plugin__icon--inline"></i> Загрузить файл';

            wrapper.appendChild(button);

            return wrapper;

        },

        uploadedFile: function (data) {

            var wrapper = editor.draw.node('div', elementsClasses.wrapper),
                name = editor.draw.node('input', elementsClasses.file.name),
                extension = editor.draw.node('span', elementsClasses.file.extension),
                size = editor.draw.node('span', elementsClasses.file.size);

            wrapper.dataset.url = data.url;
            name.value = data.name;
            extension.textContent = data.extension.toUpperCase();
            size.textContent = data.size;

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
            message: 'Ошибка во время загрузки файла'+(error.message?': '+error.message:'')
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

            if (Math.ceil(file.size / KBYTE) > config.maxSize) {

                return false;

            }

            return true;

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

            editor.core.XMLHTTP.abort();

            upload.aborted = true;

        }

    };



   /*
   * Public methods
   */

    var prepare = function (_config) {

        config.fetchUrl = _config.fetchUrl || config.fetchUrl;
        config.maxSize = _config.maxSize * KBYTE  || config.maxSize;
        config.accept   = _config.accept   || config.accept;

        return Promise.resolve();

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

            name: block.querySelector('.'+elementsClasses.file.name).value,

            extension: block.querySelector('.'+elementsClasses.file.extension).textContent,

            size: block.querySelector('.'+elementsClasses.file.size).textContent,

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

        attachesPlugin = null;

    };

    var appendCallback = function () {

        upload.fire();

    };

    return {
        prepare: prepare,
        render: render,
        save: save,
        validate: validate,
        destroy:destroy,
        appendCallback: appendCallback
    };

}();