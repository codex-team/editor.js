import type EditorJS from '../../../types/index';
import { OutputData } from '../../../types/index';


/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Output sanitization', () => {
  context('Output should save inline formatting', () => {
    it('should save initial formatting for paragraph', () => {
      cy.createEditor({
        data: {
          blocks: [ {
            type: 'paragraph',
            data: { text: '<b>Bold text</b>' },
          } ],
        },
      })
        .then(async editor => {
          cy.wrap<OutputData>(await editor.save())
            .then((output) => {
              const boldText = output.blocks[0].data.text;

              expect(boldText).to.eq('<b>Bold text</b>');
            });
        });
    });

    it('should save formatting for paragraph', () => {
      cy.createEditor({})
        .as('editorInstance');

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

      cy.get<EditorJS>('@editorInstance')
        .then(async editorInstance => {
          cy.wrap(await editorInstance.save())
            .then((output) => {
              const text = output.blocks[0].data.text;

              expect(text).to.match(/<b>This text should be bold\.(<br>)?<\/b>/);
            });
        });
    });

    it('should save formatting for paragraph on paste', () => {
      cy.createEditor({})
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<p>Text</p><p><b>Bold text</b></p>',
        });

      cy.get<EditorJS>('@editorInstance')
        .then(async editorInstance => {
          cy.wrap<OutputData>(await editorInstance.save())
            .then((output) => {
              const boldText = output.blocks[1].data.text;

              expect(boldText).to.eq('<b>Bold text</b>');
            });
        });
    });
  });
});
