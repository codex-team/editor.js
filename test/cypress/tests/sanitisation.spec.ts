/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Output sanitisation', () => {
  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.createEditor({}).as('editorInstance');
    }
  });

  context('Output should save inline formatting', () => {
    it('should save initial bold formatting for paragraph', () => {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: '<b>Bold text</b>' },
            }, {
              type: 'paragraph',
              data: { text: '<strong>Important text</strong>' },
            },
          ],
        },
      }).then(async editor => {
        const output = await (editor as any).save();

        const boldText = output.blocks[0].data.text;
        const importantText = output.blocks[1].data.text;

        expect(boldText).to.eq('<b>Bold text</b>');
        expect(importantText).to.eq('<strong>Important text</strong>');
      });
    });

    it('should save initial italic formatting for paragraph', () => {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: '<i>Italic text</i>' },
            }, {
              type: 'paragraph',
              data: { text: '<em>Emphasis text</em>' },
            },
          ],
        },
      }).then(async editor => {
        const output = await (editor as any).save();

        const italicText = output.blocks[0].data.text;
        const emphasisText = output.blocks[1].data.text;

        expect(italicText).to.eq('<i>Italic text</i>');
        expect(emphasisText).to.eq('<em>Emphasis text</em>');
      });
    });

    it('should save formatting for paragraph', () => {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('This text should be bold.{selectall}');

      cy.get('[data-cy=editorjs]')
        .get('button.ce-inline-tool--bold')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('@editorInstance').then(async editorInstance => {
        const output = await (editorInstance as any).save();

        const text = output.blocks[0].data.text;

        expect(text).to.match(/<b>This text should be bold\.(<br>)?<\/b>/);
      });
    });

    it('should save formatting for paragraph on paste', () => {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .paste({ 'text/html': '<p>Text</p><p><b>Bold text</b></p>' });

      cy.get('@editorInstance').then(async editorInstance => {
        const output = await (editorInstance as any).save();

        const boldText = output.blocks[1].data.text;

        expect(boldText).to.eq('<b>Bold text</b>');
      });
    });
  });
});
