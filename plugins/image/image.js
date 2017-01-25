/**
* Image plugin for codex-editor
* @author CodeX Team <team@ifmo.su>
*
* @version 1.1.4
*/
var ceImage = {

    elementClasses : {

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

    },

    holder : null,

    /** Default path to redactors images */
    path : '/upload/redactor_images/',

    make : function ( data ) {

        var holder;

        if (data) {

            if ( data.isstretch || data.isstretch === 'true') {
                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.stretched, 'true');
            } else {
                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.centered, 'false');
            }

            return holder;

        } else {

            holder = ceImage.ui.makeForm();

            return holder;
        }
    },

    /**
     * this tool works when tool is clicked in toolbox
     */
    appendCallback : function(event) {

        /** Upload image and call success callback*/
        ceImage.uploadButtonClicked(event);

    },

    /**
    * Settings panel content
    * @return {Element} element contains all settings
    */
    makeSettings : function () {

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

            ceImage.addSelectTypeClickListener(selectTypeButton, type);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    },

    addSelectTypeClickListener : function(el, type) {

        el.addEventListener('click', function() {

            ceImage.selectTypeClicked(type);

        }, false);

    },

    selectTypeClicked : function(type) {

        var current      = codex.content.currentNode,
            blockContent = current.childNodes[0],
            image   = ceImage.ui.getImage(current),
            inFeed  = false,
            wrapper = current.querySelector('.' + ceImage.elementClasses.imageWrapper);

        if (!image) {
            return;
        }

        if (current.classList.contains(codex.ui.className.BLOCK_IN_FEED_MODE)) {
            inFeed = true;
        }

        /** Clear classList */
        current.className = '';
        image.className   = '';

        if (inFeed) {
            current.classList.add(codex.ui.className.BLOCK_IN_FEED_MODE);
        }

        /** Add important first-level class ce_block */
        current.classList.add(codex.ui.className.BLOCK_CLASSNAME);

        if (type === 'stretched') {

            image.classList.add(ceImage.elementClasses.uploadedImage.stretched);

            blockContent.classList.add(ceImage.elementClasses.blockStretched);

            /** Setting dataset for saver */
            wrapper.dataset.stretched = true;

        } else if (type === 'centered') {

            image.classList.add(ceImage.elementClasses.uploadedImage.centered);

            blockContent.classList.remove(ceImage.elementClasses.blockStretched);

            /** Setting dataset for saver */
            wrapper.dataset.stretched = false;
        }

        codex.toolbar.settings.close();
    },

    render : function( data ) {

        return this.make(data);
    },

    save : function ( block ) {

        var content    = block,
            image   = ceImage.ui.getImage(content),
            caption = content.querySelector('.' + ceImage.elementClasses.imageCaption);

        console.log(image);

        var data = {
            background : false,
            border : false,
            isstretch : content.dataset.stretched === 'true' ? true : false,
            file : {
                url : image.dataset.src || image.src,
                bigUrl : image.dataset.bigUrl,
                width  : image.dataset.width,
                height : image.dataset.height,
                additionalData : image.dataset.additionalData
            },
            caption : caption.textContent,
            cover : null
        };

        return data;
    },

    uploadButtonClicked : function(event) {

        var beforeSend = ceImage.photoUploadingCallbacks.beforeSend,
            success    = ceImage.photoUploadingCallbacks.success,
            error      = ceImage.photoUploadingCallbacks.error;

        /** Define callbacks */
        codex.transport.selectAndUpload({
            beforeSend,
            success,
            error,
        });
    }

};

ceImage.ui = {

    holder : function(){

        var element = document.createElement('DIV');

        element.classList.add(ceImage.elementClasses.formHolder);
        element.classList.add(ceImage.elementClasses.ce_image);

        return element;
    },

    uploadButton : function(){

        var button = document.createElement('SPAN');

        button.classList.add(ceImage.elementClasses.uploadButton);

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

        div.classList.add(ceImage.elementClasses.imageWrapper);

        return div;
    },

    caption : function() {

        var div  = document.createElement('div');

        div.classList.add(ceImage.elementClasses.imageCaption);
        div.contentEditable = true;

        return div;
    },
    /**
    * Draws form for image upload
    */
    makeForm : function() {

        var holder       = ceImage.ui.holder(),
            uploadButton = ceImage.ui.uploadButton();

        holder.appendChild(uploadButton);

        uploadButton.addEventListener('click', ceImage.uploadButtonClicked, false );

        ceImage.holder = holder;

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
            image    = ceImage.ui.image(file, imageTypeClass),
            caption  = ceImage.ui.caption(),
            wrapper  = ceImage.ui.wrapper();

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

        var image = data.querySelector('.' + ceImage.elementClasses.uploadedImage.centered) ||
                    data.querySelector('.' + ceImage.elementClasses.uploadedImage.stretched);

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
            image    = ceImage.ui.image(file, ceImage.elementClasses.uploadedImage.centered),
            caption  = ceImage.ui.caption(),
            wrapper  = ceImage.ui.wrapper();

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
            image    = ceImage.ui.image(file, ceImage.elementClasses.uploadedImage.stretched),
            caption  = ceImage.ui.caption(),
            wrapper  = ceImage.ui.wrapper();

        caption.textContent = text;

        wrapper.dataset.stretched = 'true';
        /** Appeding to the wrapper */
        wrapper.appendChild(image);
        wrapper.appendChild(caption);

        return wrapper;

    }

};

ceImage.photoUploadingCallbacks = {

    /** Before sending ajax request */
    beforeSend : function() {

        var input = codex.transport.input,
            files = input.files,
            fileReader = new FileReader();

        var _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];

        var type = files[0].type.split('/');

        var result = _validFileExtensions.some(function(ext) {
           return ext == type[1]
        });

        if (!result) {
            Tip.show('error', 'Вы выбрали не картинку');
            return;
        }

        reader = new FileReader();
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

            var image = ceImage.make(data);
            codex.content.switchBlock(ceImage.holder, image, 'image_extended');
            image.classList.add('ce-image__preview');

            /**
             * Change holder to image
             */
            ceImage.holder = image;
        };

    },

    /** Photo was uploaded successfully */
    success : function(result) {

        var parsed = JSON.parse(result),
            data,
            currentBlock = codex.content.currentNode,
            image;

        /**
        * Preparing {Object} data to draw an image
        * @uses ceImage.make method
        */
        data = parsed.data || {
            background : false,
            border   : false,
            isstretch : false,
            file : {
                url    : ceImage.path + 'o_' + parsed.filename,
                bigUrl : null,
                width  : null,
                height : null,
                additionalData : null
            },
            caption : '',
            cover : null
        };

        ceImage.holder.classList.remove('ce-image__preview');

        /**
         * Change src of image
         */
        var image = ceImage.holder.getElementsByTagName('IMG')[0];

        image.src = parsed.data.file.url;
        image.dataset.bigUrl = parsed.data.file.bigUrl;
    },

    /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
    error : function(result) {

        var oldHolder = ceImage.holder;
        var form = ceImage.ui.makeForm();

        codex.content.switchBlock(oldHolder, form, 'image_extended');

        Tip.show('error', 'Ошибка при загрузке файла на сервер');
    },

    /**
     * Direct upload
     * @param url
     */
    uploadImage : function(path) {

        var ajaxUrl = location.protocol + '//' + location.hostname,
            file,
            image,
            image_plugin,
            current = codex.content.currentNode,
            beforeSend,
            success_callback;

        /** When image is uploaded to redactors folder */
        success_callback = function(data) {

            var imageInfo = JSON.parse(data);

            var image = image_plugin.getElementsByTagName('IMG')[0];

            image.dataset.stretched = false;
            image.dataset.src = imageInfo.file.url;
            image.dataset.bigUrl = imageInfo.file.bigUrl;
            image.dataset.width = imageInfo.file.width;
            image.dataset.height = imageInfo.file.height;
            image.dataset.additionalData = imageInfo.file.additionalData;

            console.log(image_plugin);
            
            image_plugin.classList.remove('ce-image__preview');

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

            image_plugin = codex.tools.image_extended.make(data);

            image_plugin.classList.add('ce-image__preview');

            codex.content.switchBlock(codex.content.currentNode, image_plugin, 'image_extended');

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
    },

    uploadFromUploadCare : function(image) {

        var image_plugin;

        /** Preparing data for XMLHTTP */
        var data = {
            url: '/club/fetchImage',
            type: "POST",
            data : {
                url: image
            },
            beforeSend : function() {

                var data = {
                    background: false,
                    border: false,
                    isStretch: false,
                    file: {
                        url: image,
                        bigUrl: null,
                        width: null,
                        height: null,
                        additionalData: null
                    },
                    caption: '',
                    cover: null
                };

                /** Using Image plugin make method */
                image_plugin = codex.tools.image_extended.make(data);

                image_plugin.classList.add('ce-image__preview');

                codex.content.switchBlock(codex.content.currentNode, image_plugin, 'image_extended');

            },
            success : function(result) {

                var data = JSON.parse(result);

                var image = image_plugin.getElementsByTagName('IMG')[0];

                image.dataset.stretched = false;
                image.dataset.src = data.file.url;
                image.dataset.bigUrl = data.file.bigUrl;
                image.dataset.width = data.file.width;
                image.dataset.height = data.file.height;
                image.dataset.additionalData = data.file.additionalData;

                image_plugin.classList.remove('ce-image__preview');

            }
        };

        codex.core.ajax(data);


    }

};