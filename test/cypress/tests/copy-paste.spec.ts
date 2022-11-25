import Header from '@editorjs/header';
import Image from '@editorjs/simple-image';
import * as _ from '../../../src/components/utils';

describe('Copy pasting from Editor', function () {
  beforeEach(function () {
    cy.createEditor({
      tools: {
        header: Header,
        image: Image,
      },
    }).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  context('pasting', function () {
    it('should paste plain text', function () {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'Some plain text',
        })
        .wait(0)
        .should('contain', 'Some plain text');
    });

    it('should paste inline html data', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<p><b>Some text</b></p>',
        })
        .should('contain.html', '<b>Some text</b>');
    });

    it('should paste several blocks if plain text contains new lines', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'First block\n\nSecond block',
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should paste several blocks if html contains several paragraphs', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<p>First block</p><p>Second block</p>',
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should paste using custom data type', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'application/x-editor-js': JSON.stringify([
            {
              tool: 'paragraph',
              data: {
                text: 'First block',
              },
            },
            {
              tool: 'paragraph',
              data: {
                text: 'Second block',
              },
            },
          ]),
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should parse block tags', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<h2>First block</h2><p>Second block</p>',
        });

      cy.get('[data-cy=editorjs]')
        .get('h2.ce-header')
        .should('contain', 'First block');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-paragraph')
        .should('contain', 'Second block');
    });

    it('should parse pattern', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'https://codex.so/public/app/img/external/codex2x.png',
        });

      cy.get('[data-cy=editorjs]')
        // In Edge test are performed slower, so we need to increase timeout to wait until image is loaded on the page
        .get('img', { timeout: 10000 })
        .should('have.attr', 'src', 'https://codex.so/public/app/img/external/codex2x.png');
    });
  });

  context('copying', function () {
    it('should copy inline fragment', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('Some text{selectall}')
        .copy()
        .then(clipboardData => {
          /**
           * As no blocks selected, clipboard data will be empty as will be handled by browser
           */
          expect(clipboardData).to.be.empty;
        });
    });

    it('should copy several blocks', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('First block{enter}');

      cy.get('[data-cy=editorjs')
        .get('div.ce-block')
        .next()
        .type('Second block')
        .type('{movetostart}')
        .trigger('keydown', {
          shiftKey: true,
          keyCode: _.keyCodes.UP,
        })
        .copy()
        .then(clipboardData => {
          expect(clipboardData['text/html']).to.match(/<p>First block(<br>)?<\/p><p>Second block(<br>)?<\/p>/);
          expect(clipboardData['text/plain']).to.eq(`First block\n\nSecond block`);

          /**
           * Need to wait for custom data as it is set asynchronously
           */
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data[0].tool).to.eq('paragraph');
            expect(data[0].data.text).to.match(/First block(<br>)?/);
            expect(data[1].tool).to.eq('paragraph');
            expect(data[1].data.text).to.match(/Second block(<br>)?/);
          });
        });
    });
  });

  context('cutting', function () {
    it('should cut inline fragment', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('Some text{selectall}')
        .cut()
        .then(clipboardData => {
          /**
           * As no blocks selected, clipboard data will be empty as will be handled by browser
           */
          expect(clipboardData).to.be.empty;
        });
    });

    it('should cut several blocks', function () {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('First block{enter}');

      cy.get('[data-cy=editorjs')
        .get('div.ce-block')
        .next()
        .type('Second block')
        .type('{movetostart}')
        .trigger('keydown', {
          shiftKey: true,
          keyCode: _.keyCodes.UP,
        })
        .cut()
        .then(clipboardData => {
          expect(clipboardData['text/html']).to.match(/<p>First block(<br>)?<\/p><p>Second block(<br>)?<\/p>/);
          expect(clipboardData['text/plain']).to.eq(`First block\n\nSecond block`);

          /**
           * Need to wait for custom data as it is set asynchronously
           */
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data[0].tool).to.eq('paragraph');
            expect(data[0].data.text).to.match(/First block(<br>)?/);
            expect(data[1].tool).to.eq('paragraph');
            expect(data[1].data.text).to.match(/Second block(<br>)?/);
          });
        });

      cy.get('[data-cy=editorjs]')
        .should('not.contain', 'First block')
        .should('not.contain', 'Second block');
    });

    it('should cut lots of blocks', function () {
      const numberOfBlocks = 50;

      for (let i = 0; i < numberOfBlocks; i++) {
        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .last()
          .click()
          .type(`Block ${i}{enter}`);
      }

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .first()
        .click()
        .type('{ctrl+A}')
        .type('{ctrl+A}')
        .cut()
        .then((clipboardData) => {
          /**
           * Need to wait for custom data as it is set asynchronously
           */
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data.length).to.eq(numberOfBlocks + 1);
          });
        });
    });
  });
});
