var codex = require('../../editor');

var toolbar = (function(toolbar) {

    toolbar.init = function() {
        toolbar.settings = require('./settings');
        toolbar.inline   = require('./inline');
        toolbar.toolbox  = require('./toolbox');
    };

    /**
     * Margin between focused node and toolbar
     */
    toolbar.defaultToolbarHeight = 49;

    toolbar.defaultOffset = 34;

    toolbar.opened = false;

    toolbar.current = null;

    /**
     * @protected
     */
    toolbar.open = function (){

        codex.nodes.toolbar.classList.add('opened');
        this.opened = true;

    };

    /**
     * @protected
     */
    toolbar.close = function(){

        codex.nodes.toolbar.classList.remove('opened');
        this.opened  = false;

        this.current = null;

        for (var button in codex.nodes.toolbarButtons){
            codex.nodes.toolbarButtons[button].classList.remove('selected');
        }

        /** Close toolbox when toolbar is not displayed */
        codex.toolbar.toolbox.close();
        codex.toolbar.settings.close();

    };

    toolbar.toggle = function(){

        if ( !this.opened ){

            this.open();

        } else {

            this.close();

        }

    };

    toolbar.hidePlusButton = function() {
        codex.nodes.plusButton.classList.add('hide');
    };

    toolbar.showPlusButton = function() {
        codex.nodes.plusButton.classList.remove('hide');
    };

    /**
     * Moving toolbar to the specified node
     */
    toolbar.move = function() {

        /** Close Toolbox when we move toolbar */
        codex.toolbar.toolbox.close();

        if (!codex.content.currentNode) {
            return;
        }

        var toolbarHeight = codex.nodes.toolbar.clientHeight || codex.toolbar.defaultToolbarHeight,
            newYCoordinate = codex.content.currentNode.offsetTop - (codex.toolbar.defaultToolbarHeight / 2) + codex.toolbar.defaultOffset;

        codex.nodes.toolbar.style.transform = `translate3D(0, ${Math.floor(newYCoordinate)}px, 0)`;

        /** Close trash actions */
        codex.toolbar.settings.hideRemoveActions();

    };

    return toolbar;

})({});

toolbar.init();

codex.toolbar = toolbar;
module.exports = toolbar;

