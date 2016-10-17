/**
 * Content parsing module
 *
 * @author Codex team
 * @version 1.0.0
 */

var parser = (function() {

    /**
     * @protected
     *
     * Asynchronously parses textarea input string to HTML editor blocks
     */
    var parseTextareaContent = function () {

        var initialContent = cEditor.nodes.textarea.value;

        if ( initialContent.trim().length === 0 ) return true;


        cEditor.parser

        /** Get child nodes async-aware */
            .getNodesFromString(initialContent)

            /** Then append nodes to the redactor */
            .then(cEditor.parser.appendNodesToRedactor)

            /** Write log if something goes wrong */
            .catch(function(error) {
                cEditor.core.log('Error while parsing content: %o', 'warn', error);
            });

    };

    /**
     * @protected
     *
     * Parses string to nodeList
     * @param string inputString
     * @return Primise -> nodeList
     */
    var getNodesFromString = function (inputString) {

        return Promise.resolve().then(function() {

            var contentHolder = document.createElement('div');

            contentHolder.innerHTML = inputString;

            /**
             *    Returning childNodes will include:
             *        - Elements (html-tags),
             *        - Texts (empty-spaces or non-wrapped strings )
             *        - Comments and other
             */
            return contentHolder.childNodes;

        });
    };

    /**
     * @protected
     *
     * Appends nodes to the redactor
     * @param nodeList nodes - list for nodes to append
     */
    var appendNodesToRedactor = function(nodes) {

        /**
         * Sequence of one-by-one nodes appending
         * Uses to save blocks order after async-handler
         */
        var nodeSequence = Promise.resolve();


        for (var index = 0; index < nodes.length ; index++ ) {

            /** Add node to sequence at specified index */
            cEditor.parser.appendNodeAtIndex(nodeSequence, nodes, index);

        }

    };

    /**
     * @protected
     *
     * Append node at specified index
     */
    var appendNodeAtIndex = function (nodeSequence, nodes, index) {

        /** We need to append node to sequence */
        nodeSequence

        /** first, get node async-aware */
            .then(function() {

                return cEditor.parser.getNodeAsync(nodes , index);

            })

            /**
             *    second, compose editor-block from node
             *    and append it to redactor
             */
            .then(function(node){

                var block = cEditor.parser.createBlockByDomNode(node);

                if ( cEditor.core.isDomNode(block) ) {

                    block.contentEditable = "true";

                    /** Mark node as redactor block*/
                    block.classList.add('ce_block');

                    /** Append block to the redactor */
                    cEditor.nodes.redactor.appendChild(block);

                    /** Save block to the cEditor.state array */
                    cEditor.state.blocks.push(block);

                    return block;

                }
                return null;
            })

            .then(cEditor.ui.addBlockHandlers)

            /** Log if something wrong with node */
            .catch(function(error) {
                cEditor.core.log('Node skipped while parsing because %o', 'warn', error);
            });

    };

    /**
     * @protected
     *
     * Asynchronously returns node from nodeList by index
     * @return Promise to node
     */
    var getNodeAsync = function (nodeList, index) {

        return Promise.resolve().then(function() {

            return nodeList.item(index);

        });
    };

    /**
     * @protected
     *
     * Creates editor block by DOM node
     *
     * First-level blocks (see cEditor.settings.blockTags) saves as-is,
     * other wrapps with <p>-tag
     *
     * @param DOMnode node
     * @return First-level node (paragraph)
     */
    var createBlockByDomNode = function (node) {

        /** First level nodes already appears as blocks */
        if ( cEditor.parser.isFirstLevelBlock(node) ){

            /** Save plugin type in data-type */
            node = this.storeBlockType(node);

            return node;
        }

        /** Other nodes wraps into parent block (paragraph-tag) */
        var parentBlock,
            nodeContent     = node.textContent.trim(),
            isPlainTextNode = node.nodeType != cEditor.core.nodeTypes.TAG;


        /** Skip empty textNodes with space-symbols */
        if (isPlainTextNode && !nodeContent.length) return null;

        /** Make <p> tag */
        parentBlock = cEditor.draw.block('P');

        if (isPlainTextNode){
            parentBlock.textContent = nodeContent.replace(/(\s){2,}/, '$1'); // remove double spaces
        } else {
            parentBlock.appendChild(node);
        }

        /** Save plugin type in data-type */
        parentBlock = this.storeBlockType(parentBlock);

        return parentBlock;

    };

    /**
     * @protected
     *
     * It's a crutch
     * - - - - - - -
     * We need block type stored as data-attr
     * Now supports only simple blocks : P, HEADER, QUOTE, CODE
     * Remove it after updating parser module for the block-oriented structure:
     *       - each block must have stored type
     * @param {Element} node
     */
    var storeBlockType = function (node) {

        switch (node.tagName) {
            case 'P' :          node.dataset.type = 'paragraph'; break;
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':          node.dataset.type = 'header'; break;
            case 'BLOCKQUOTE':  node.dataset.type = 'quote'; break;
            case 'CODE':        node.dataset.type = 'code'; break;
        }

        return node;

    };

    /**
     * @protected
     *
     * Check DOM node for display style: separated block or child-view
     */
    var isFirstLevelBlock = function (node) {

        return node.nodeType == cEditor.core.nodeTypes.TAG &&
            node.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME);

    };

    return {
        parseTextareaContent    : parseTextareaContent,
        getNodesFromString      : getNodesFromString,
        appendNodesToRedactor   : appendNodesToRedactor,
        appendNodeAtIndex       : appendNodeAtIndex,
        getNodeAsync            : getNodeAsync,
        createBlockByDomNode    : createBlockByDomNode,
        storeBlockType          : storeBlockType,
        isFirstLevelBlock       : isFirstLevelBlock
    };

})();

module.exports = parser;
