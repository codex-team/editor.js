import type EditorJS from '../../../types/index';
import type { OutputData, SanitizerConfig } from '../../../types/index';


/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
describe('Sanitizing', () => {
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
        .get('[data-item-name="bold"]')
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

  /**
   * @see https://github.com/codex-team/editor.js/issues/2501
   */
  it('should keep attributes allowed by every inline tool when several tools use the same tag', () => {
    /**
     * Minimal inline tool wrapping text with <span class="font" data-font-setting="...">
     */
    class FontTool {
      public static isInline = true;

      /**
       *
       */
      public static get sanitize(): SanitizerConfig {
        return {
          span: {
            class: true,
            'data-font-setting': true,
          },
        } as unknown as SanitizerConfig;
      }

      /** render is required for correct implementation of the InlineTool class */
      public render(): HTMLElement {
        return document.createElement('button');
      }

      /** surround is required for correct implementation of the InlineTool class */
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public surround(): void { }

      /** checkState is required for correct implementation of the InlineTool class */
      public checkState(): boolean {
        return false;
      }
    }

    /**
     * Minimal inline tool wrapping text with <span class="size" data-font-size-setting="...">
     */
    class FontSizeTool extends FontTool {
      /**
       *
       */
      public static get sanitize(): SanitizerConfig {
        return {
          span: {
            class: true,
            'data-font-size-setting': true,
          },
        } as unknown as SanitizerConfig;
      }
    }

    const text = 'Plain <span class="font" data-font-setting="serif">font</span> and ' +
      '<span class="size" data-font-size-setting="12">size</span> and ' +
      '<span class="font size" data-font-setting="serif" data-font-size-setting="12">both</span>';

    cy.createEditor({
      tools: {
        font: FontTool,
        fontSize: FontSizeTool,
      },
      data: {
        blocks: [ {
          type: 'paragraph',
          data: { text },
        } ],
      },
    })
      .then(async editor => {
        cy.wrap<OutputData>(await editor.save())
          .then((output) => {
            expect(output.blocks[0].data.text).to.eq(text);
          });
      });
  });

  it('should sanitize unwanted html on blocks merging', function () {
    cy.createEditor({
      data: {
        blocks: [
          {
            id: 'block1',
            type: 'paragraph',
            data: {
              text: 'First block',
            },
          },
          {
            id: 'paragraph',
            type: 'paragraph',
            data: {
              /**
               * Tool does not support spans in its sanitization config
               */
              text: 'Second <span id="taint-html">XSS<span> block',
            },
          },
        ],
      },
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .click()
      .type('{home}')
      .type('{backspace}');

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks[0].data.text).to.eq('First blockSecond XSS block'); // text has been merged, span has been removed
      });
  });
});

