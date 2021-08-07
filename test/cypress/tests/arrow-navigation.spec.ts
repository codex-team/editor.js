describe('Arrow navigation', () => {
  beforeEach(() => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: '',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<i>Second</i> <b>paragraph</b>',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Third paragraph',
            },
          },
        ],
      },
    }).as('EditorJS');
  });

  context('right arrow', () => {
    it('should move caret to the right by right arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .click()
        .type('Some text{movetostart}{rightarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(1);
          expect(range.endOffset).to.eq(1);
        });
    });

    it('should navigate to next block by right arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Hello {rightarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });

    it('should navigate from empty block to next block by right arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('{rightarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });

    it('should navigate from inline fragment to next block by right arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{rightarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Third paragraph');
        });
    });

    it('should navigate to empty block by right arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{enter}')
        .click()
        .type('{movetoend}{rightarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('');
        });
    });
  });

  context('arrow down', () => {
    it('should set caret to next line by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .click()
        .type('Some text{shift}{enter}Another line{movetostart}{downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.textContent).to.eq('Another line');
        });
    });

    it('should navigate to next block by arrow down from the end of line to the middle of next one', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Hello {downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.be.closeTo(6, 1);
          expect(range.endOffset).to.be.closeTo(6, 1);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });

    it('should navigate to next block from empty block by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('{downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });

    it('should navigate from inline fragment to next block by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.closeTo('Second paragraph'.length, 1);
          expect(range.endOffset).to.closeTo('Second paragraph'.length, 1);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Third paragraph');
        });
    });

    it('should navigate to empty block by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{enter}')
        .click()
        .type('{movetoend}{downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('');
        });
    });

    it('should save caret horizontal offset on navigation by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{enter}')
        .click()
        .type('{movetostart}' + '{rightarrow}'.repeat(5))
        .type('{downarrow}')
        .next()
        .type('{downarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.be.closeTo(5, 1);
          expect(range.endOffset).to.be.closeTo(5, 1);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Third paragraph');
        });
    });
  });

  context('right arrow', () => {
    it('should move caret to the left by left arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .click()
        .type('Some text{leftarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq('Some tex'.length);
          expect(range.endOffset).to.eq('Some tex'.length);
        });
    });

    it('should navigate to previous block by left arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Hello{enter}')
        .next()
        .type('Some text{movetostart}{leftarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq('Hello'.length);
          expect(range.endOffset).to.eq('Hello'.length);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Hello');
        });
    });

    it('should navigate from empty block to previous block by left arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Hello{enter}')
        .next()
        .type('{leftarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq('Hello'.length);
          expect(range.endOffset).to.eq('Hello'.length);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Hello');
        });
    });

    it('should navigate from inline fragment to previous block by left arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .click()
        .type('Some text')
        .next()
        .type('{movetostart}{leftarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq('Some text'.length);
          expect(range.endOffset).to.eq('Some text'.length);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Some text');
        });
    });

    it('should navigate to empty block by left arrow', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .click()
        .type('{movetostart}{leftarrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('');
        });
    });
  });


  context('arrow up', () => {
    it('should set caret to previous line by arrow up', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .click()
        .type('Some text{shift}{enter}Another line{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq('Some text'.length);
          expect(range.endOffset).to.eq('Some text'.length);
          expect(range.startContainer.textContent).to.eq('Some text');
        });
    });

    it('should navigate to previous block by arrow up', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Some long long long text')
        .next()
        .type('{movetoend}{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.be.closeTo('Second paragraph'.length, 3);
          expect(range.endOffset).to.be.closeTo('Second paragraph'.length, 3);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Some long long long text');
        });
    });

    it('should navigate to previous block from empty block by arrow up', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{enter}')
        .next()
        .type('{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });

    it('should navigate from inline fragment to previous block by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .type('Some text')
        .next()
        .type('{movetoend}{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.closeTo('Some text'.length, 1);
          expect(range.endOffset).to.closeTo('Some text'.length, 1);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Some text');
        });
    });

    it('should navigate to empty block by up down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.eq(0);
          expect(range.endOffset).to.eq(0);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('');
        });
    });

    it('should save caret horizontal offset on navigation by arrow down', () => {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .eq(1)
        .type('{movetoend}{enter}');

      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .last()
        .type('{movetostart}' + '{rightarrow}'.repeat(5))
        .type('{uparrow}')
        .prev()
        .type('{uparrow}');

      cy.window()
        .then(win => {
          const selection = win.getSelection();
          const range = selection.getRangeAt(0);

          expect(range.startOffset).to.be.closeTo(5, 1);
          expect(range.endOffset).to.be.closeTo(5, 1);
          expect(range.startContainer.parentElement.closest('.ce-block').textContent).to.eq('Second paragraph');
        });
    });
  });
});
