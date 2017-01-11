var comments = function(comments) {

    comments.add = function(node) {

        var id = node.dataset.id,
            commentInput = codex.draw.commentInput();

        commentInput.dataset.blockId = id;

        node.insertBefore(commentInput, node.firstChild);

    };

    return comments;

}({});

module.exports = comments;