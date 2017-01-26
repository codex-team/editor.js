/**
 * Image plugin for codex-editor
 * @author CodeX Team <team@ifmo.su>
 *
 * @version 1.2.0
 */
var image = (function(image) {

    /**
     * @private
     *
     * CSS classNames
     */
    var elementClasses_ = {

        ce_image      : 'ce-image',
        loading       : 'ce-plugin-image__loader',
        blockStretched: 'ce-block--stretched',
        uploadedImage : {
            centered  : 'ce-plugin-image__uploaded--centered',
            stretched : 'ce-plugin-image__uploaded--stretched'
        },
        imageCaption  : 'ce-plugin-image__caption',
        imageWrapper  : 'ce-plugin-image__wrapper',
        formHolder    : 'ce-plugin-image__holder',
        uploadButton  : 'ce-plugin-image__button',
        imagePreview  : 'ce-image__preview'

    };

    /**
     *
     * @private
     *
     * UI methods
     */
    var ui_ = {

        holder : function(){

            var element = document.createElement('DIV');

            element.classList.add(elementClasses_.formHolder);
            element.classList.add(elementClasses_.ce_image);

            return element;
        },

        uploadButton : function(){

            var button = document.createElement('SPAN');

            button.classList.add(elementClasses_.uploadButton);

            button.innerHTML = '<i class="ce-icon-picture"> </i>';
            button.innerHTML += 'Загрузить фотографию';

            return button;

        },

        /**
         * @param {object} file - file path
         * @param {string} style - css class
         * @return {object} image - document IMG tag
         */
        image : function(file, style) {

            var image = document.createElement('IMG');

            image.classList.add(style);

            image.src = file.url;
            image.dataset.bigUrl = file.bigUrl;

            return image;
        },

        wrapper : function() {

            var div = document.createElement('div');

            div.classList.add(elementClasses_.imageWrapper);

            return div;
        },

        caption : function() {

            var div  = document.createElement('div');

            div.classList.add(elementClasses_.imageCaption);
            div.contentEditable = true;

            return div;
        },
        /**
         * Draws form for image upload
         */
        makeForm : function() {

            var holder       = ui_.holder(),
                uploadButton = ui_.uploadButton();

            holder.appendChild(uploadButton);

            uploadButton.addEventListener('click', uploadButtonClicked_, false );

            image.holder = holder;

            return holder;
        },


        /**
         * wraps image and caption
         * @param {object} data - image information
         * @param {string} imageTypeClass - plugin's style
         * @param {boolean} stretched - stretched or not
         * @return wrapped block with image and caption
         */
        makeImage : function(data, imageTypeClass, stretched) {

            var file = data.file,
                text = data.caption,
                type     = data.type,
                image    = ui_.image(file, imageTypeClass),
                caption  = ui_.caption(),
                wrapper  = ui_.wrapper();

            caption.textContent = text;

            wrapper.dataset.stretched = stretched;
            /** Appeding to the wrapper */
            wrapper.appendChild(image);
            wrapper.appendChild(caption);

            return wrapper;
        },

        /**
         * @param {HTML} data - Rendered block with image
         */
        getImage : function(data) {

            var image = data.querySelector('.' + elementClasses_.uploadedImage.centered) ||
                data.querySelector('.' + elementClasses_.uploadedImage.stretched);

            return image;
        },

        /**
         * wraps image and caption
         * @deprecated
         * @param {object} data - image information
         * @return wrapped block with image and caption
         */
        centeredImage : function(data) {

            var file = data.file,
                text = data.caption,
                type     = data.type,
                image    = ui_.image(file, elementClasses_.uploadedImage.centered),
                caption  = ui_.caption(),
                wrapper  = ui_.wrapper();

            caption.textContent = text;

            wrapper.dataset.stretched = 'false';

            /** Appeding to the wrapper */
            wrapper.appendChild(image);
            wrapper.appendChild(caption);

            return wrapper;
        },

        /**
         * wraps image and caption
         * @deprecated
         * @param {object} data - image information
         * @return stretched image
         */
        stretchedImage : function(data) {

            var file = data.file,
                text = data.caption,
                type     = data.type,
                image    = ui_.image(file, elementClasses_.uploadedImage.stretched),
                caption  = ui_.caption(),
                wrapper  = ui_.wrapper();

            caption.textContent = text;

            wrapper.dataset.stretched = 'true';

            /** Appeding to the wrapper */
            wrapper.appendChild(image);
            wrapper.appendChild(caption);

            return wrapper;

        }

    };

    /**
     * @private
     *
     * After render callback
     */
    var uploadButtonClicked_ = function(event) {

        var beforeSend = uploadingCallbacks_.ByClick.beforeSend,
            success    = uploadingCallbacks_.ByClick.success,
            error      = uploadingCallbacks_.ByClick.error;

        /** Define callbacks */
        codex.transport.selectAndUpload({
            beforeSend: beforeSend,
            success: success,
            error: error
        });
    };

    var methods_ = {

        addSelectTypeClickListener : function(el, type) {

            el.addEventListener('click', function() {

                methods_.selectTypeClicked(type);

            }, false);

        },

        selectTypeClicked : function(type) {

            var current = codex.content.currentNode,
                blockContent = current.childNodes[0],
                image = ui_.getImage(current),
                inFeed = false,
                wrapper = current.querySelector('.' + elementClasses_.imageWrapper);

            if (!image) {
                return;
            }

            /** Clear classList */
            current.className = '';
            image.className = '';

            /** Add important first-level class ce_block */
            current.classList.add(codex.ui.className.BLOCK_CLASSNAME);

            if (type === 'stretched') {

                image.classList.add(elementClasses_.uploadedImage.stretched);

                blockContent.classList.add(elementClasses_.blockStretched);

                /** Setting dataset for saver */
                wrapper.dataset.stretched = true;

            } else if (type === 'centered') {

                image.classList.add(elementClasses_.uploadedImage.centered);

                blockContent.classList.remove(elementClasses_.blockStretched);

                /** Setting dataset for saver */
                wrapper.dataset.stretched = false;
            }

            codex.toolbar.settings.close();
        }
    };

    /**
     * @private
     * Callbacks
     */
    var uploadingCallbacks_ = {

        ByClick : {

            /**
             * Before sending ajax request
             */
            beforeSend : function() {

                var input = codex.transport.input,
                    files = input.files;

                var validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];

                var type = files[0].type.split('/');

                var result = validFileExtensions.some(function(ext) {
                    return ext == type[1]
                });

                if (!result) {
                    return;
                }

                var reader = new FileReader();
                reader.readAsDataURL(files[0]);

                reader.onload = function(e) {

                    var data = {
                        background : false,
                        border   : false,
                        isstretch : false,
                        file : {
                            url    : e.target.result,
                            bigUrl : null,
                            width  : null,
                            height : null,
                            additionalData : null
                        },
                        caption : '',
                        cover : null
                    };

                    var newImage = make_(data);

                    codex.content.switchBlock(image.holder, newImage, 'image_extended');
                    newImage.classList.add(elementClasses_.imagePreview);

                    /**
                     * Change holder to image
                     */
                    image.holder = newImage;
                };

            },

            /** Photo was uploaded successfully */
            success : function(result) {

                var parsed = JSON.parse(result),
                    data,
                    currentBlock = codex.content.currentNode;

                /**
                 * Preparing {Object} data to draw an image
                 * @uses ceImage.make method
                 */
                data = parsed.data;

                image.holder.classList.remove(elementClasses_.imagePreview);

                /**
                 * Change src of image
                 */
                var newImage = image.holder.getElementsByTagName('IMG')[0];

                newImage.src            = parsed.data.file.url;
                newImage.dataset.bigUrl = parsed.data.file.bigUrl;
                newImage.dataset.width  = parsed.data.file.width;
                newImage.dataset.height = parsed.data.file.height;
                newImage.dataset.additionalData = parsed.data.file.additionalData;

            },

            /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
            error : function(result) {

                var oldHolder = image.holder;
                var form = ui_.makeForm();

                codex.content.switchBlock(oldHolder, form, 'image_extended');

            }
        },

        ByPaste : {

            /**
             * Direct upload
             * Any URL that contains image extension
             * @param url
             */
            uploadImageFromUrl : function(path) {

                var ajaxUrl = image.config.uploadUrl,
                    file,
                    image_plugin,
                    current = codex.content.currentNode,
                    beforeSend,
                    success_callback;

                /** When image is uploaded to redactors folder */
                success_callback = function(data) {

                    var imageInfo = JSON.parse(data);

                    var newImage = image_plugin.getElementsByTagName('IMG')[0];

                    newImage.dataset.stretched = false;
                    newImage.dataset.src = imageInfo.file.url;
                    newImage.dataset.bigUrl = imageInfo.file.bigUrl;
                    newImage.dataset.width = imageInfo.file.width;
                    newImage.dataset.height = imageInfo.file.height;
                    newImage.dataset.additionalData = imageInfo.file.additionalData;

                    image_plugin.classList.remove(elementClasses_.imagePreview);

                };

                /** Before sending XMLHTTP request */
                beforeSend = function() {

                    var content = current.querySelector('.ce-block__content');

                    var data = {
                        background: false,
                        border: false,
                        isStretch: false,
                        file: {
                            url: path,
                            bigUrl: null,
                            width: null,
                            height: null,
                            additionalData: null
                        },
                        caption: '',
                        cover: null
                    };

                    image_plugin = codex.tools.image_extended.render(data);

                    image_plugin.classList.add(elementClasses_.imagePreview);

                    var img = image_plugin.querySelector('img');

                    codex.content.switchBlock(codex.content.currentNode, image_plugin, 'image_extended');

                };

                /** Preparing data for XMLHTTP */
                var data = {
                    url: image.config.uploadUrl,
                    type: "POST",
                    data : {
                        url: path
                    },
                    beforeSend : beforeSend,
                    success : success_callback
                };

                codex.core.ajax(data);
            }

        }
    };

    /**
     * Default image holder which will be replaced after image upload
     * @type {null}
     */
    image.holder = null;

    /**
     * Image path
     * @type {null}
     */
    image.path   = null;

	/**
     * Plugin configuration
     */
    image.config = null;

    /**
     *
     * @private
     *
     * @param data
     * @return {*}
     *
     */
    var make_ = function ( data ) {

        var holder;

        if (data) {

            if ( data.isstretch || data.isstretch === 'true') {

                holder = ui_.makeImage(data, elementClasses_.uploadedImage.stretched, 'true');

            } else {

                holder = ui_.makeImage(data, elementClasses_.uploadedImage.centered, 'false');

            }

            return holder;

        } else {

            holder = ui_.makeForm();

            return holder;
        }
    };

    /**
     * @private
     *
     * Prepare clear data before save
     *
     * @param data
     */
    var prepareDataForSave_ = function(data) {

    };

    /**
     * @public
     * @param config
     */
    image.prepare = function(config) {
        image.config = config;
    };

    /**
     * @public
     *
     * this tool works when tool is clicked in toolbox
     */
    image.appendCallback = function(event) {

        /** Upload image and call success callback*/
        uploadButtonClicked_(event);

    };

    /**
     * @public
     *
     * @param data
     * @return {*}
     */
    image.render = function( data ) {

        return make_(data);
    };

    /**
     * @public
     *
     * @param block
     * @return {{background: boolean, border: boolean, isstretch: boolean, file: {url: (*|string|Object), bigUrl: (null|*), width: *, height: *, additionalData: null}, caption: (string|*|string), cover: null}}
     */
    image.save = function ( block ) {

        var content    = block,
            image   = ui_.getImage(content),
            caption = content.querySelector('.' + elementClasses_.imageCaption);

        var data = {
            background : false,
            border : false,
            isstretch : content.dataset.stretched === 'true' ? true : false,
            file : {
                url : image.dataset.src || image.src,
                bigUrl : image.dataset.bigUrl,
                width  : image.width,
                height : image.height,
                additionalData :null
            },
            caption : caption.textContent,
            cover : null
        };

        return data;
    };


    /**
     * @public
     *
     * Settings panel content
     * @return {Element} element contains all settings
     */
    image.makeSettings = function () {

        var holder  = document.createElement('DIV'),
            types   = {
                centered  : 'По центру',
                stretched : 'На всю ширину'
            },
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_image--settings';

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = 'ce_plugin_image--select_button';

            methods_.addSelectTypeClickListener(selectTypeButton, type);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    };

    /**
     * Share as API
     */
    image.uploadImageFromUri = uploadingCallbacks_.ByPaste.uploadImageFromUrl;

    image.urlPastedCallbacks = {

        /**
         * Upload image by URL
         *
         * @uses codex Image tool
         * @param filename
         * @returns {Element}
         */
        uploadedImage : function(filename) {

            var data = {
                background: false,
                border: false,
                isStretch: false,
                file: {
                    url: "upload/redactor_images/" + filename,
                    bigUrl: "upload/redactor_images/" + filename,
                    width: null,
                    height: null,
                    additionalData: "null"
                },
                caption: '',
                cover: null
            };

            /** Using Image plugin make method */
            var image = ceImage.make(data);

            return image;

        },


        /**
         * Direct upload from pasted path
         * @param path
         */
        uploadImage : function(path) {

            var ajaxUrl = location.protocol + '//' + location.hostname + ':32769',
                file,
                image,
                current = codex.content.currentNode,
                beforeSend,
                success_callback;

            /** When image is uploaded to redactors folder */
            success_callback = function(data) {

                console.log(data);
                return;
                var file = JSON.parse(data);
                image = ceImage.urlPastedCallbacks.uploadedImage(file.filename);
                codex.content.switchBlock(current, image, 'image');

            };

            /** Before sending XMLHTTP request */
            beforeSend = function() {
                var content = current.querySelector('.ce-block__content');
                content.classList.add('ce-plugin-image__loader');
            };

            /** Preparing data for XMLHTTP */
            var data = {
                url: '/club/fetchImage',
                type: "POST",
                data : {
                    url: path
                },
                beforeSend : beforeSend,
                success : success_callback
            };

            codex.core.ajax(data);
        }
    };

    return image;

})({});
