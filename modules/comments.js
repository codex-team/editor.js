var comments = function(comments) {

    comments.add = function(node, selection) {

        var blockId = node.dataset.id,
            commentInput = codex.draw.commentInput(),
            commentId = +new Date(),
            highlight = codex.draw.commentSelection(),
            range = selection.getRangeAt(0);

        commentInput.dataset.blockId        = blockId;
        commentInput.dataset.commentId      = commentId;
        commentInput.dataset.selectionStart = range.startOffset;
        commentInput.dataset.selectionEnd   = range.endOffset;

        highlight.dataset.commentId   = commentId;

        range.surroundContents(highlight);

        codex.nodes.commentsSide.appendChild(commentInput);
        commentInput.querySelector('.ce-comment__input').focus();
    };

    comments.send = function(wrapper, sendButton) {

        var input        = wrapper.querySelector('.ce-comment__input'),
            time         = codex.draw.commentTmstmp(wrapper.dataset.edited),
            text         = codex.draw.commentText(input.value),
            deleteButton = codex.draw.commentDeleteButton(),
            editButton   = codex.draw.commentEditButton();


        wrapper.replaceChild(text, input);
        wrapper.replaceChild(time, sendButton);
        wrapper.appendChild(deleteButton);
        wrapper.appendChild(editButton);

    };

    comments.edit = function(wrapper, commentsField) {

        var text = wrapper.querySelector('.ce-comment__text').textContent,
            sendButton = codex.draw.commentSendButton(),
            newWrapper = codex.draw.commentInput(text);

        newWrapper.dataset.edited = true;
        newWrapper.appendChild(sendButton);

        commentsField.replaceChild(newWrapper, wrapper);
        newWrapper.querySelector('.ce-comment__input').focus();

    };

    comments.delete = function(wrapper) {

        var commentId = wrapper.dataset.commentId,
            commentSelection = codex.comments.getCommentSelectionById(commentId);

        commentSelection.className = '';

        wrapper.parentNode.removeChild(wrapper);

    };

    comments.makeComment = function(commentData) {

        var wrapper = codex.draw.node('DIV', 'ce-comment__wrapper'),
            text = codex.draw.commentText(commentData.text),
            time = codex.draw.commentTmstmp(false, commentData.time),
            deleteBtn = codex.draw.commentDeleteButton(),
            editBtn = codex.draw.commentEditButton();

        wrapper.dataset.blockId        = commentData['block-id'];
        wrapper.dataset.commentId      = commentData['comment-id'];
        wrapper.dataset.selectionStart = commentData['selection-start'];
        wrapper.dataset.selectionEnd   = commentData['selection-end'];

        wrapper.addEventListener('mouseenter', codex.callback.commentHovered);
        wrapper.addEventListener('mouseleave', codex.callback.commentBlured);

        wrapper.appendChild(text);
        wrapper.appendChild(time);
        wrapper.appendChild(deleteBtn);
        wrapper.appendChild(editBtn);

        comments.createCommentSelection(commentData['comment-id'], commentData['block-id'], commentData['selection-start'], commentData['selection-end']);

        codex.nodes.commentsSide.appendChild(wrapper);

        return wrapper;

    };

    comments.getBlockById = function(id) {
       return codex.nodes.redactor.querySelector('.ce-block[data-id="'+id+'"]');
    };

   comments.getCommentSelectionById = function(id) {
        return codex.nodes.redactor.querySelector('span[data-comment-id="'+id+'"]');
    };

   comments.getCommentById = function(id) {
        return codex.nodes.commentsSide.querySelector('div[data-comment-id="'+id+'"]');
    };

   comments.createCommentSelection = function(commentId, blockId, selectionStart, selectionEnd) {

       var block = comments.getBlockById(blockId),
           range = document.createRange(),
           highlight = codex.draw.commentSelection(),
           textNode = codex.content.getDeepestTextNodeFromPosition(block, 0);

       highlight.dataset.commentId = commentId;

       range.setStart(textNode, selectionStart);
       range.setEnd(textNode, selectionEnd);

       range.surroundContents(highlight);

   };

    return comments;

}({});

module.exports = comments;