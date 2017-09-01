/**
 * Inline toolbar
 *
 * Contains from tools:
 * Bold, Italic, Underline and Anchor
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function () {
  let inline = {};

  let editor = this;

  inline.buttonsOpened = null;
  inline.actionsOpened = null;
  inline.wrappersOffset = null;

    /**
     * saving selection that need for execCommand for styling
     *
     */
  inline.storedSelection = null;

    /**
     * @protected
     *
     * Open inline toobar
     */
  inline.show = function () {
    var currentNode = editor.modules.content.currentNode,
        tool = currentNode.dataset.tool,
        plugin;

        /**
         * tool allowed to open inline toolbar
         */
    plugin = editor.tools[tool];

    if (!plugin.showInlineToolbar)
      return;

    var selectedText = inline.getSelectionText(),
        toolbar      = editor.nodes.inlineToolbar.wrapper;

    if (selectedText.length > 0) {
            /** Move toolbar and open */
      editor.modules.toolbar.inline.move();

            /** Open inline toolbar */
      toolbar.classList.add('opened');

            /** show buttons of inline toolbar */
      editor.modules.toolbar.inline.showButtons();
    }
  };

    /**
     * @protected
     *
     * Closes inline toolbar
     */
  inline.close = function () {
    var toolbar = editor.nodes.inlineToolbar.wrapper;

    toolbar.classList.remove('opened');
  };

    /**
     * @private
     *
     * Moving toolbar
     */
  inline.move = function () {
    if (!this.wrappersOffset) {
      this.wrappersOffset = this.getWrappersOffset();
    }

    var coords          = this.getSelectionCoords(),
        defaultOffset   = 0,
        toolbar         = editor.nodes.inlineToolbar.wrapper,
        newCoordinateX,
        newCoordinateY;

    if (toolbar.offsetHeight === 0) {
      defaultOffset = 40;
    }

    newCoordinateX = coords.x - this.wrappersOffset.left;
    newCoordinateY = coords.y + window.scrollY - this.wrappersOffset.top - defaultOffset - toolbar.offsetHeight;

    toolbar.style.transform = `translate3D(${Math.floor(newCoordinateX)}px, ${Math.floor(newCoordinateY)}px, 0)`;

        /** Close everything */
    editor.modules.toolbar.inline.closeButtons();
    editor.modules.toolbar.inline.closeAction();
  };

    /**
     * @private
     *
     * Tool Clicked
     */

  inline.toolClicked = function (event, type) {
        /**
         * For simple tools we use default browser function
         * For more complicated tools, we should write our own behavior
         */
    switch (type) {
      case 'createLink' : editor.modules.toolbar.inline.createLinkAction(event, type); break;
      default           : editor.modules.toolbar.inline.defaultToolAction(type); break;
    }

        /**
         * highlight buttons
         * after making some action
         */
    editor.nodes.inlineToolbar.buttons.childNodes.forEach(editor.modules.toolbar.inline.hightlight);
  };

    /**
     * @private
     *
     * Saving wrappers offset in DOM
     */
  inline.getWrappersOffset = function () {
    var wrapper = editor.nodes.wrapper,
        offset  = this.getOffset(wrapper);

    this.wrappersOffset = offset;
    return offset;
  };

    /**
     * @private
     *
     * Calculates offset of DOM element
     *
     * @param el
     * @returns {{top: number, left: number}}
     */
  inline.getOffset = function ( el ) {
    var _x = 0;
    var _y = 0;

    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += (el.offsetLeft + el.clientLeft);
      _y += (el.offsetTop + el.clientTop);
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  };

    /**
     * @private
     *
     * Calculates position of selected text
     * @returns {{x: number, y: number}}
     */
  inline.getSelectionCoords = function () {
    var sel = document.selection, range;
    var x = 0, y = 0;

    if (sel) {
      if (sel.type != 'Control') {
        range = sel.createRange();
        range.collapse(true);
        x = range.boundingLeft;
        y = range.boundingTop;
      }
    } else if (window.getSelection) {
      sel = window.getSelection();

      if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        if (range.getClientRects) {
          range.collapse(true);
          var rect = range.getClientRects()[0];

          if (!rect) {
            return;
          }

          x = rect.left;
          y = rect.top;
        }
      }
    }
    return { x: x, y: y };
  };

    /**
     * @private
     *
     * Returns selected text as String
     * @returns {string}
     */
  inline.getSelectionText = function () {
    var selectedText = '';

        // all modern browsers and IE9+
    if (window.getSelection) {
      selectedText = window.getSelection().toString();
    }

    return selectedText;
  };

    /** Opens buttons block */
  inline.showButtons = function () {
    var buttons = editor.nodes.inlineToolbar.buttons;

    buttons.classList.add('opened');

    editor.modules.toolbar.inline.buttonsOpened = true;

        /** highlight buttons */
    editor.nodes.inlineToolbar.buttons.childNodes.forEach(editor.modules.toolbar.inline.hightlight);
  };

    /** Makes buttons disappear */
  inline.closeButtons = function () {
    var buttons = editor.nodes.inlineToolbar.buttons;

    buttons.classList.remove('opened');

    editor.modules.toolbar.inline.buttonsOpened = false;
  };

    /** Open buttons defined action if exist */
  inline.showActions = function () {
    var action = editor.nodes.inlineToolbar.actions;

    action.classList.add('opened');

    editor.modules.toolbar.inline.actionsOpened = true;
  };

    /** Close actions block */
  inline.closeAction = function () {
    var action = editor.nodes.inlineToolbar.actions;

    action.innerHTML = '';
    action.classList.remove('opened');
    editor.modules.toolbar.inline.actionsOpened = false;
  };


    /**
    * Callback for keydowns in inline toolbar "Insert link..." input
    */
  let inlineToolbarAnchorInputKeydown_ = function (event) {
    if (event.keyCode != editor.modules.core.keys.ENTER) {
      return;
    }

    let editable        = editor.modules.content.currentNode,
        storedSelection = editor.modules.toolbar.inline.storedSelection;

    editor.modules.toolbar.inline.restoreSelection(editable, storedSelection);
    editor.modules.toolbar.inline.setAnchor(this.value);

        /**
         * Preventing events that will be able to happen
         */
    event.preventDefault();
    event.stopImmediatePropagation();

    editor.modules.toolbar.inline.clearRange();
  };

    /** Action for link creation or for setting anchor */
  inline.createLinkAction = function (event) {
    var isActive = this.isLinkActive();

    var editable        = editor.modules.content.currentNode,
        storedSelection = editor.modules.toolbar.inline.saveSelection(editable);

        /** Save globally selection */
    editor.modules.toolbar.inline.storedSelection = storedSelection;

    if (isActive) {
            /**
             * Changing stored selection. if we want to remove anchor from word
             * we should remove anchor from whole word, not only selected part.
             * The solution is than we get the length of current link
             * Change start position to - end of selection minus length of anchor
             */
      editor.modules.toolbar.inline.restoreSelection(editable, storedSelection);

      editor.modules.toolbar.inline.defaultToolAction('unlink');
    } else {
            /** Create input and close buttons */
      var action = editor.modules.draw.inputForLink();

      editor.nodes.inlineToolbar.actions.appendChild(action);

      editor.modules.toolbar.inline.closeButtons();
      editor.modules.toolbar.inline.showActions();

            /**
             * focus to input
             * Solution: https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus
             * Prevents event after showing input and when we need to focus an input which is in unexisted form
             */
      action.focus();
      event.preventDefault();

            /** Callback to link action */
      editor.modules.listeners.add(action, 'keydown', inlineToolbarAnchorInputKeydown_, false);
    }
  };

  inline.isLinkActive = function () {
    var isActive = false;

    editor.nodes.inlineToolbar.buttons.childNodes.forEach(function (tool) {
      var dataType = tool.dataset.type;

      if (dataType == 'link' && tool.classList.contains('hightlighted')) {
        isActive = true;
      }
    });

    return isActive;
  };

    /** default action behavior of tool */
  inline.defaultToolAction = function (type) {
    document.execCommand(type, false, null);
  };

    /**
     * @private
     *
     * Sets URL
     *
     * @param {String} url - URL
     */
  inline.setAnchor = function (url) {
    document.execCommand('createLink', false, url);

        /** Close after URL inserting */
    editor.modules.toolbar.inline.closeAction();
  };

    /**
     * @private
     *
     * Saves selection
     */
  inline.saveSelection = function (containerEl) {
    var range = window.getSelection().getRangeAt(0),
        preSelectionRange = range.cloneRange(),
        start;

    preSelectionRange.selectNodeContents(containerEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    start = preSelectionRange.toString().length;

    return {
      start: start,
      end: start + range.toString().length
    };
  };

    /**
     * @private
     *
     * Sets to previous selection (Range)
     *
     * @param {Element} containerEl - editable element where we restore range
     * @param {Object} savedSel - range basic information to restore
     */
  inline.restoreSelection = function (containerEl, savedSel) {
    var range     = document.createRange(),
        charIndex = 0;

    range.setStart(containerEl, 0);
    range.collapse(true);

    var nodeStack = [ containerEl ],
        node,
        foundStart = false,
        stop = false,
        nextCharIndex;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType == 3) {
        nextCharIndex = charIndex + node.length;

        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
          range.setStart(node, savedSel.start - charIndex);
          foundStart = true;
        }
        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
          range.setEnd(node, savedSel.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        var i = node.childNodes.length;

        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    var sel = window.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);
  };

    /**
     * @private
     *
     * Removes all ranges from window selection
     */
  inline.clearRange = function () {
    var selection = window.getSelection();

    selection.removeAllRanges();
  };

    /**
     * @private
     *
     * sets or removes hightlight
     */
  inline.hightlight = function (tool) {
    var dataType = tool.dataset.type;

    if (document.queryCommandState(dataType)) {
      editor.modules.toolbar.inline.setButtonHighlighted(tool);
    } else {
      editor.modules.toolbar.inline.removeButtonsHighLight(tool);
    }

        /**
         *
         * hightlight for anchors
         */
    var selection = window.getSelection(),
        tag = selection.anchorNode.parentNode;

    if (tag.tagName == 'A' && dataType == 'link') {
      editor.modules.toolbar.inline.setButtonHighlighted(tool);
    }
  };

    /**
     * @private
     *
     * Mark button if text is already executed
     */
  inline.setButtonHighlighted = function (button) {
    button.classList.add('hightlighted');

        /** At link tool we also change icon */
    if (button.dataset.type == 'link') {
      var icon = button.childNodes[0];

      icon.classList.remove('ce-icon-link');
      icon.classList.add('ce-icon-unlink');
    }
  };

    /**
     * @private
     *
     * Removes hightlight
     */
  inline.removeButtonsHighLight = function (button) {
    button.classList.remove('hightlighted');

        /** At link tool we also change icon */
    if (button.dataset.type == 'link') {
      var icon = button.childNodes[0];

      icon.classList.remove('ce-icon-unlink');
      icon.classList.add('ce-icon-link');
    }
  };


  return inline;
});
