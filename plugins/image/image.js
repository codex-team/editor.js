/**
* Image plugin for codex-editor
* @author CodeX Team <team@ifmo.su>
*
* @version 1.1.3
*/
var ceImage = {

    elementClasses : {

        ce_image      : 'ce-image',
        loading       : 'ce-plugin-image__loader',
        blockStretched: 'ce-block--stretched',
        uploadedImage : {
                centered  : 'ce-plugin-image__uploaded--centered',
                stretched : 'ce-plugin-image__uploaded--stretched',
        },
        imageCaption  : 'ce-plugin-image__caption',
        imageWrapper  : 'ce-plugin-image__wrapper',
        formHolder    : 'ce-plugin-image__holder',
        uploadButton  : 'ce-plugin-image__button',

    },

    holder : null,

    /** Default path to redactors images */
    path : '/upload/redactor_images/',

    make : function ( data ) {

        var holder;

        if (data) {

            if ( data.isStretch !== 'true') {
                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.centered, 'false');
            } else {
                holder = ceImage.ui.makeImage(data, ceImage.elementClasses.uploadedImage.stretched, 'true');
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
                        stretched : 'На всю ширину',
                    },
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_image--settings';

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = 'ce_plugin_image--select_button';

            this.addSelectTypeClickListener(selectTypeButton, type);

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
            wrapper = current.querySelector('.' + ceImage.elementClasses.imageWrapper);

        /** Clear classList */
        current.className = '';
        image.className   = '';

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
    },

    render : function( data ) {

        return this.make(data);
    },

    save : function ( block ) {

        var content    = block,
            image   = ceImage.ui.getImage(content),
            caption = content.querySelector('.' + ceImage.elementClasses.imageCaption);

        var data = {
            background : false,
            border : false,
            isStretch : content.dataset.stretched,
            file : {
                url : image.src,
                bigUrl : null,
                width  : image.width,
                height : image.height,
                additionalData :null,
            },
            caption : caption.textContent,
            cover : null,
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
    },

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

        var file = data.file.url,
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

        var file = data.file.url,
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

        var file = data.file.url,
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
        ceImage.holder.classList.add(ceImage.elementClasses.loading);
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
        data = {
            background : false,
            border   : false,
            isStretch : false,
            file : {
                url    : ceImage.path + 'o_' + parsed.filename,
                bigUrl : null,
                width  : null,
                height : null,
                additionalData : null,
            },
            caption : '',
            cover : null,
        };

        image = ceImage.make(data);

        /**
         * If current block is empty, we can replace it to uploaded image
         * Or insert new block
         */
        codex.content.switchBlock(ceImage.holder, image, 'image');
    },

    /** Error callback. Sends notification to user that something happend or plugin doesn't supports method */
    error : function(result) {
        console.log('Choosen file is not an image or image is corrupted');
        codex.notifications.errorThrown();
    }

};


/**
* Add plugin it to redactor tools
*/
// ceImage = {
//
//     type             : 'image',
//     iconClassname    : 'ce-icon-picture',
//     make             : ceImage.make,
//     appendCallback   : ceImage.appendCallback,
//     settings         : ceImage.makeSettings(),
//     render           : ceImage.render,
//     save             : ceImage.save,
//     isStretched      : true,
//     displayInToolbox : true,
//     enableLineBreaks : false
//
// };