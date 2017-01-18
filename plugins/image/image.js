/**
* Image plugin for codex-editor
* @author CodeX Team <team@ifmo.su>
*
* @version 1.1.3
*/

var image = (function(image) {

    var elementClasses = {

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
        uploadButton  : 'ce-plugin-image__button'
    };

    var holder = null;

    /** Default path to redactors images */
    var path = '/upload/redactor_images/';

    var ui = {

        holder : function(){

            var element = document.createElement('DIV');

            element.classList.add(elementClasses.formHolder);
            element.classList.add(elementClasses.ce_image);

            return element;
        },

        uploadButton : function(){

            var button = document.createElement('SPAN');

            button.classList.add(elementClasses.uploadButton);

            button.innerHTML = '<i class="ce-icon-picture"> </i>';
            button.innerHTML += 'Загрузить фотографию';

            return button;

        },

        /**
         * @param {string} source - file path
         * @param {string} style - css class
         * @return {object} image - document IMG tag
         */
        image : function(source, style) {

            var image = document.createElement('IMG');

            image.classList.add(style);

            image.src = source;

            return image;
        },

        wrapper : function() {

            var div = document.createElement('div');

            div.classList.add(elementClasses.imageWrapper);

            return div;
        },

        caption : function() {

            var div  = document.createElement('div');

            div.classList.add(elementClasses.imageCaption);
            div.contentEditable = true;

            return div;
        },
        /**
         * Draws form for image upload
         */
        makeForm : function() {

            var holder       = ui.holder(),
                uploadButton = ui.uploadButton();

            holder.appendChild(uploadButton);

            uploadButton.addEventListener('click', methods.uploadButtonClicked, false );

            holder = holder;

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

            var file = data.file.url,
                text = data.caption,
                type     = data.type,
                image    = ui.image(file, imageTypeClass),
                caption  = ui.caption(),
                wrapper  = ui.wrapper();

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

            var image = data.querySelector('.' + elementClasses.uploadedImage.centered) ||
                data.querySelector('.' + elementClasses.uploadedImage.stretched);

            return image;
        },

        /**
         * wraps image and caption
         * @deprecated
         * @param {object} data - image information
         * @return wrapped block with image and caption
         */
        centeredImage : function(data) {

            var file = data.file.url,
                text = data.caption,
                type     = data.type,
                image    = ui.image(file, elementClasses.uploadedImage.centered),
                caption  = ui.caption(),
                wrapper  = ui.wrapper();

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

            var file = data.file.url,
                text = data.caption,
                type     = data.type,
                image    = ui.image(file, elementClasses.uploadedImage.stretched),
                caption  = ui.caption(),
                wrapper  = ui.wrapper();

            caption.textContent = text;

            wrapper.dataset.stretched = 'true';
            /** Appeding to the wrapper */
            wrapper.appendChild(image);
            wrapper.appendChild(caption);

            return wrapper;

        }
    };

    var methods = {

        uploadButtonClicked : function(event) {

            /** Define callbacks */
            codex.transport.selectAndUpload({
                beforeSend: photoUploadingCallbacks.beforeSend,
                success: photoUploadingCallbacks.success,
                error: photoUploadingCallbacks.error
            });
        },

        addSelectTypeClickListener : function(el, type) {

            el.addEventListener('click', function() {

                methods.selectTypeClicked(type);

            }, false);

        },

        selectTypeClicked : function(type) {

            var current      = codex.content.currentNode,
                blockContent = current.childNodes[0],
                image   = ui.getImage(current),
                wrapper = current.querySelector('.' + elementClasses.imageWrapper);

            /** Clear classList */
            current.className = '';
            image.className   = '';

            /** Add important first-level class ce_block */
            current.classList.add(codex.ui.className.BLOCK_CLASSNAME);

            if (type === 'stretched') {

                image.classList.add(elementClasses.uploadedImage.stretched);

                blockContent.classList.add(elementClasses.blockStretched);

                /** Setting dataset for saver */
                wrapper.dataset.stretched = true;

            } else if (type === 'centered') {

                image.classList.add(elementClasses.uploadedImage.centered);

                blockContent.classList.remove(elementClasses.blockStretched);

                /** Setting dataset for saver */
                wrapper.dataset.stretched = false;
            }
        }
    };

    var photoUploadingCallbacks = {

        /** Before sending ajax request */
        beforeSend : function() {
            holder.classList.add(elementClasses.loading);
        },

        /** Photo was uploaded successfully */
        success : function(result) {

            var parsed = JSON.parse(result),
                data,
                currentBlock = codex.content.currentNode,
                imageReady;

            /**
             * Preparing {Object} data to draw an image
             * @uses make method
             */
            data = {
                background : false,
                border   : false,
                isStretch : false,
                file : {
                    url    : path + 'o_' + parsed.filename,
                    bigUrl : null,
                    width  : null,
                    height : null,
                    additionalData : null
                },
                caption : '',
                cover : null
            };

            imageReady = image.make(data);

            /**
             * If current block is empty, we can replace it to uploaded image
             * Or insert new block
             */
            codex.content.switchBlock(holder, imageReady, 'image');
        },

        /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
        error : function(result) {
            console.log('Choosen file is not an image or image is corrupted');
            codex.notifications.errorThrown();
        }

    };

    /**
     * Public method
     */
    image.make = function ( data ) {

        var imageHolder;

        if (data) {

            if ( data.isStretch !== 'true') {
                imageHolder = ui.makeImage(data, elementClasses.uploadedImage.centered, 'false');
            } else {
                imageHolder = ui.makeImage(data, elementClasses.uploadedImage.stretched, 'true');
            }

        } else {

            imageHolder = ui.makeForm();

        }

        holder = imageHolder;
        return imageHolder;
    };

    /**
     * this tool works when tool is clicked in toolbox
     */
    image.appendCallback = function(event) {

        /** Upload image and call success callback*/
        methods.uploadButtonClicked(event);

    };

    /**
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

            methods.addSelectTypeClickListener(selectTypeButton, type);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    };

    image.render = function( data ) {

        return image.make(data);
    };

    image.save = function ( block ) {

        var content    = block,
            image   = ui.getImage(content),
            caption = content.querySelector('.' + elementClasses.imageCaption);

        var data = {
            background : false,
            border : false,
            isStretch : content.dataset.stretched,
            file : {
                url : image.src,
                bigUrl : null,
                width  : image.width,
                height : image.height,
                additionalData :null
            },
            caption : caption.textContent,
            cover : null
        };

        return data;
    };

    return image;

})({});