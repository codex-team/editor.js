var comments = function(comments) {

    var draw = {

        commentsField: function(blockId) {

            var field = codex.draw.node('DIV', 'ce-comments-field');

            field.dataset.blockId = blockId;

            return field;

        },

        input: function(text) {

            var wrapper     = codex.draw.node('DIV', 'ce-comment'),
                input       = codex.draw.node('DIV', 'ce-comment__input', {'contentEditable': 'true', 'textContent':text||''}),
                deleteBtn   = codex.draw.node('DIV', 'ce-comment__delete', {'textContent': 'Delete'}),
                postBtn     = codex.draw.node('DIV', 'ce-comment__post', {'textContent': text?'Save':'Comment'});

            postBtn.addEventListener('click', callbacks.commentClicked);
            deleteBtn.addEventListener('click', callbacks.deleteClicked);

            wrapper.appendChild(input);
            wrapper.appendChild(postBtn);
            wrapper.appendChild(deleteBtn);

            wrapper.dataset.edited = text?'edited ':'';

            return wrapper;

        },

        comment: function(data) {

            if (!data.text) return;

            var wrapper     = codex.draw.node('DIV', 'ce-comment'),
                text        = codex.draw.node('DIV', 'ce-comment__text', {'textContent': data.text}),
                date        = new Date().toLocaleDateString('en-US',{
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric',
                                                                        hour12: false
                                                                    }),
                time        = codex.draw.node('DIV', 'ce-comment__time', {'textContent': date}),
                deleteBtn   = codex.draw.node('DIV', 'ce-comment__delete', {'textContent': 'Delete'}),
                editBtn     = codex.draw.node('DIV', 'ce-comment__edit', {'textContent': 'Edit'});

            editBtn.addEventListener('click', callbacks.editClicked);
            deleteBtn.addEventListener('click', callbacks.deleteClicked);

            wrapper.dataset.edited = data.edited;
            time.dataset.edited = data.edited;

            wrapper.appendChild(text);
            wrapper.appendChild(time);
            wrapper.appendChild(editBtn);
            wrapper.appendChild(deleteBtn);

            return wrapper;

        }

    };

    var callbacks = {

        commentClicked: function(e) {

            var field   = e.path[2],
                wrapper = e.path[1],
                input   = wrapper.querySelector('.ce-comment__input');

            if (input.textContent.trim() == '') return;

            var comment = draw.comment({
                            text: input.textContent,
                            edited: wrapper.dataset.edited
            });

            field.replaceChild(comment, wrapper);

        },

        editClicked: function(e) {


            var field   = e.path[2],
                wrapper = e.path[1],
                text   = wrapper.querySelector('.ce-comment__text');

            var comment = draw.input(text.textContent);

            field.replaceChild(comment, wrapper);

        },

        deleteClicked: function(e) {

            var field   = e.path[2],
                wrapper = e.path[1];

            field.removeChild(wrapper);

        }

    };

    var methods = {

        getCoords: function(block) {

            var rect = block.getBoundingClientRect();

            return {
                x: pageXOffset + rect.left,
                y: pageYOffset + rect.top
            }

        }

    }

    comments.add = function(block) {

        var blockId = block.dataset.id;

        var field = codex.nodes.commentsSidebar.querySelector('.ce-comments-field[data-block-id="'+blockId+'"]') ||
                    draw.commentsField(blockId);

        var comment = draw.input();

        comment.querySelector('.ce-comment__input').focus();

        field.appendChild(comment);

        var blockCoords = methods.getCoords(block);

        field.style.top = blockCoords.y + 'px';

        codex.nodes.commentsSidebar.appendChild(field);

    };


    return comments;

}({});

module.exports = comments;