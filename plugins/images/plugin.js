/**
* Image plugin for codex-editor
* @author CodeX Team <team@ifmo.su>
*
* @version 0.0.1
*/
var ceImage = {

	make : function ( data ) {

		var holder       = ceImage.ui.holder(),
			uploadButton = ceImage.ui.uploadButton();

		holder.textContent = 'Past image URL or file';
		holder.appendChild(uploadButton);

		holder.contentEditable = true;

		return holder;

	},

	render : function( data ){

		return this.make(data);

	},

	/** */
	save : function ( block ){

	},

	ui : {

		holder : function(){

			var element = document.createElement('DIV');

			element.classList.add('ce-plugin-image__holder');

			return element;

		},

		uploadButton : function(){

			var button = document.createElement('SPAN');

			button.classList.add('ce-plugin-image__button');

			button.innerHTML = '<i class="ce-icon-picture"></i>';

			return button;

		}

	}



};

/**
* Add plugin it to redactor tools
*/
cEditor.tools.image = {

    type           : 'image',
    iconClassname  : 'ce-icon-picture',
    make           : ceImage.make,
    render         : ceImage.render,
    save           : ceImage.save

};
