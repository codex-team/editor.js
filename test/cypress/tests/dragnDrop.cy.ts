import Image from '@editorjs/simple-image';
import * as _ from '../../../src/components/utils';
import type EditorJS from '../../../../types/index';


describe('Drag and drop the block of Editor', function () {
  beforeEach(function () {
    cy.createEditor({
      tools: {
        image: Image,
      },
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Block 0',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Block 1',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Block 2',
            },
          },
        ],
      },
    }).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  // Create URI
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  const uri = 'data:image/png;base64,' + base64Image;

  // Define the file to be dropped
  const fileName = 'codex2x.png';
  const fileType = 'image/png';


  // Convert base64 to Blob
  const blob = Cypress.Blob.base64StringToBlob(base64Image);

  const file = new File([blob], fileName, { type: fileType });
  const dataTransfer = new DataTransfer();

  // add the file to the DataTransfer object
  dataTransfer.items.add(file);

  /**
   * @todo check with dropping file other than the image.
   */
  it('should drop image before the block', function () {

    // Test by dropping the image.
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(1)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = -20;
        // Dragover on target block little bit above the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(1)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    cy.get('[data-cy=editorjs]')
      // In Edge test are performed slower, so we need to
      // increase timeout to wait until image is loaded on the page
      .get('div.ce-block')
      .eq(1)
      .find('img', { timeout: 10000 })
      .should('have.attr', 'src', uri);
  });

  it('should drop image after the block', function () {

    // Test by dropping the image.
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(1)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = 20;
        // Dragover on target block little bit below the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(1)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    cy.get('[data-cy=editorjs]')
      // In Edge test are performed slower, so we need to
      // increase timeout to wait until image is loaded on the page
      .get('div.ce-block')
      .eq(2)
      .find('img', { timeout: 10000 })
      .should('have.attr', 'src', uri);
  });

  it('should drop image before the first block', function () {
    // Test by dropping the image.
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = -20;
        // Dragover on target block little bit above the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(0)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      // In Edge test are performed slower, so we need to
      // increase timeout to wait until image is loaded on the page
      .eq(0)
      .find('img', { timeout: 10000 })
      .should('have.attr', 'src', uri);
  });

  it('should have block dragover style on the top of target block', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click()
      .click();

    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = -20;
        // Dragover on target block little bit above the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(2)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .then(($element) => {
            // check for dragover top style on target element.
            const classes = $element.attr('class').split(' ');

            expect(classes).to.include('ce-block--drop-target');
            expect(classes).to.include('ce-block--drop-target-top');
          });
      });
  });

  it('should have block dragover style on the bottom of target block', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click()
      .click();

    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = 20;
        // Dragover on target block little bit below the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(2)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .then(($element) => {
            // check for dragover top style on target element.
            const classes = $element.attr('class').split(' ');

            expect(classes).to.include('ce-block--drop-target');
            expect(classes).to.include('ce-block--drop-target-bottom');
          });
      });
  });

  it('should drag the first block and drop after the last block.', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click()
      .click();

    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = 20;
        // Dragover on target block little bit below the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(2)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(3); // 3 blocks are still here
        expect(blocks[0].data.text).to.eq('Block 1');
        expect(blocks[1].data.text).to.eq('Block 2');
        expect(blocks[2].data.text).to.eq('Block 0');
      });
  });

  it('should drag the last block and drop before the first block.', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .click();

    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(0)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = -20;
        // Dragover on target block little bit above the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(0)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(3); // 3 blocks are still here
        expect(blocks[0].data.text).to.eq('Block 2');
        expect(blocks[1].data.text).to.eq('Block 0');
        expect(blocks[2].data.text).to.eq('Block 1');
      });
  });

  it('should drag the first two block and drop after the last block.', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(0)
      .type('{selectall}')
      .trigger('keydown', {
        shiftKey: true,
        keyCode: _.keyCodes.DOWN,
      });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(1)
      .trigger('mouseenter')
      .trigger('mousemove')
      .trigger('mouseleave');


    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = 20;
        // Dragover on target block little bit below the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(2)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(3); // 3 blocks are still here
        expect(blocks[0].data.text).to.eq('Block 2');
        expect(blocks[1].data.text).to.eq('Block 0');
        expect(blocks[2].data.text).to.eq('Block 1');
      });
  });

  it('should drag the last two block and drop before the first block.', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(1)
      .type('{selectall}')
      .trigger('keydown', {
        shiftKey: true,
        keyCode: _.keyCodes.DOWN,
      });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .trigger('mouseenter')
      .trigger('mousemove')
      .trigger('mouseleave');

    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(0)
      .trigger('dragenter')
      .then((blocks) => {
        // Get the target block rect.
        const targetBlockRect = blocks[0].getBoundingClientRect();
        const yShiftFromMiddleLine = -20;
        // Dragover on target block little bit above the middle line.
        const dragOverYCoord =
          targetBlockRect.y +
          (targetBlockRect.height / 2 + yShiftFromMiddleLine);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .eq(0)
          .trigger('dragover', {
            clientX: targetBlockRect.x,
            clientY: dragOverYCoord,
          })
          .trigger('drop', { dataTransfer });
      });

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });


    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(3); // 3 blocks are still here
        expect(blocks[0].data.text).to.eq('Block 1');
        expect(blocks[1].data.text).to.eq('Block 2');
        expect(blocks[2].data.text).to.eq('Block 0');
      });
  });
});
