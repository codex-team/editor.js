var codex = require('../editor');

var parser = (function(parser) {

    parser.init = function() {

    };

    /**
     * Splits content by `\n` and returns blocks
     */
    parser.getSeparatedTextFromContent = function(content) {
        return content.split('\n');
    };

    /** inserting text */
    parser.insertPastedContent = function(content) {

        var blocks = this.getSeparatedTextFromContent(content),
            i,
            inputIndex = cEditor.caret.getCurrentInputIndex(),
            textNode,
            parsedTextContent;

        for(i = 0; i < blocks.length; i++) {

            blocks[i].trim();

            if (blocks[i]) {
                var data = cEditor.draw.pluginsRender('paragraph', blocks[i]);
                cEditor.content.insertBlock(data);
            }
        }

    };

    /**
     * Asynchronously parses textarea input string to HTML editor blocks
     */
    parser.parseTextareaContent = function () {

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
     * Parses string to nodeList
     * @param string inputString
     * @return Primise -> nodeList
     */
    parser.getNodesFromString = function (inputString) {

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
     * Appends nodes to the redactor
     * @param nodeList nodes - list for nodes to append
     */
    parser.appendNodesToRedactor = function(nodes) {

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
     * Append node at specified index
     */
    parser.appendNodeAtIndex = function (nodeSequence, nodes, index) {

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
                    block.classList.add('ce-block');

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
     * Asynchronously returns node from nodeList by index
     * @return Promise to node
     */
    parser.getNodeAsync = function (nodeList, index) {

        return Promise.resolve().then(function() {

            return nodeList.item(index);

        });
    };

    /**
     * Creates editor block by DOM node
     *
     * First-level blocks (see cEditor.settings.blockTags) saves as-is,
     * other wrapps with <p>-tag
     *
     * @param DOMnode node
     * @return First-level node (paragraph)
     */
    parser.createBlockByDomNode = function (node) {

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
     * It's a crutch
     * - - - - - - -
     * We need block type stored as data-attr
     * Now supports only simple blocks : P, HEADER, QUOTE, CODE
     * Remove it after updating parser module for the block-oriented structure:
     *       - each block must have stored type
     * @param {Element} node
     */
    parser.storeBlockType = function (node) {

        switch (node.tagName) {
            case 'P' :          node.dataset.tool = 'paragraph'; break;
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':          node.dataset.tool = 'header'; break;
            case 'BLOCKQUOTE':  node.dataset.tool = 'quote'; break;
            case 'CODE':        node.dataset.tool = 'code'; break;
        }

        return node;

    };

    /**
     * Check DOM node for display style: separated block or child-view
     */
    parser.isFirstLevelBlock = function (node) {

        return node.nodeType == cEditor.core.nodeTypes.TAG &&
            node.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME);

    };

    return parser;

})({});

parser.init();

codex.parser = parser;
module.exports = parser;
