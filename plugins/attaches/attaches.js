var attachesPlugin = function () {

    /**
     * Private methods and props
     */

    var editor = codex.editor;

    var config = {

        fetchUrl: '/editor/attaches'

    };

    var elementsClasses = {

        defaultFormWrapper: 'attaches-plugin__default-wrapper',

        defaultFormButton: 'attaches-plugin__default-button',

        progressBar: 'attaches-plugin__progress-bar',

        wrapper: 'attaches-plugin__files-wrapper',

        loader: 'attaches-plugin__loader',

        file: {
            name        : 'attaches-plugin__file-name',
            extension   : 'attaches-plugin__file-extension',
            size        : 'attaches-plugin__file-size'
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

                var wrapper = editor.draw.node('div', elementsClasses.defaultFormWrapper),
                    progress = editor.draw.node('progress', elementsClasses.progressBar);

                progress.max = 100;
                progress.value = 0;

                wrapper.classList.add(elementsClasses.loader);

                ui.progressBar.bar = progress;

                wrapper.appendChild(progress);

                return wrapper;

            },

            change: function (value) {

                ui.progressBar.bar.value = value;

            }

        }

    };


    var upload = {

        current: null,

        /**
         * Fired codex.editor.transport selectAndUpload methods
         */
        fire: function () {

            editor.transport.selectAndUpload({
                url: config.fetchUrl,
                success: upload.end,
                beforeSend: upload.start,
                progress: upload.progress,
                error: upload.error
            });

        },

        /**
         * Will be called before upload
         * Draws load animation and progress bar
         */
        start:  function () {

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
        end: function (response) {

            try {

                var data = JSON.parse(response);

                data.size = parseInt(data.size / 1024);

                var uploadedFile = ui.uploadedFile(data);

                editor.content.switchBlock(upload.current, uploadedFile);

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

            editor.content.switchBlock(upload.content, defaultFrom);

            editor.notifications.notification({type: 'error', message: 'Ошибка во время загрузки файла'});

        }

    };



   /*
   * Public methods
   */

    var prepare = function (_config) {

        config.fetchUrl = _config.fetchUrl || config.fetchUrl;

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