import Header from '@editorjs/header';
import Image from '@editorjs/simple-image';
import * as _ from '../../../src/components/utils';
import 'cypress-file-upload';

describe('Drag and drop the block of Editor', function () {
  beforeEach(function () {
    cy.createEditor({
      tools: {
        header: Header,
        image: Image,
      },
    }).as('editorInstance');

    const numberOfBlocks = 3;
    for (let i = 0; i < numberOfBlocks; i++) {
      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .last()
        .click()
        .type(`Block ${i}{enter}`);
    }
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  /**
   * @todo check with dropping file other than the image.
   */
  it('should drop file', function () {
    // Read file locally
    cy.readFile('example/assets/codex2x.png', 'base64').then((base64) => {
      // Create URI
      const uri = 'data:image/png;base64,' + base64;

      // define the file to be dropped
      const fileName = '../../../example/assets/codex2x.png'
      const fileType = 'image/png'

      cy.fixture(fileName, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((blob) => {
          const file = new File([blob], fileName, { type: fileType })
          const dataTransfer = new DataTransfer();
          // add the file to the DataTransfer object
          dataTransfer.items.add(file)
          // Test by dropping the image.
          cy.get('[data-cy=editorjs]')
            .get('div.ce-block')
            .last()
            .trigger('dragover')
          cy.get('[data-cy=editorjs]')
            .get('div.ce-block')
            .last()
            .trigger('drop', { dataTransfer })
            .wait(1000);

          cy.get('[data-cy=editorjs]')
            // In Edge test are performed slower, so we need to
            // increase timeout to wait until image is loaded on the page
            .get('img', { timeout: 10000 })
            .should('have.attr', 'src', uri);
        });
    });
  });

  it('should have block dragover style on the top of target block', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click();

    const dataTransfer = new DataTransfer();

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
      .click();

    const dataTransfer = new DataTransfer();

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
      .click();

    const dataTransfer = new DataTransfer();
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

    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .then((blocks) => {
        expect(blocks[0].textContent).to.eq('Block 1');
        expect(blocks[1].textContent).to.eq('Block 2');
        expect(blocks[2].textContent).to.eq('Block 0');
      });
  });

  it('should drag the last block and drop before the first block.', function () {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .eq(2)
      .click();

    const dataTransfer = new DataTransfer();
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
        // Dragover on target block little bit below the middle line.
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

    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .then((blocks) => {
        expect(blocks[0].textContent).to.eq('Block 2');
        expect(blocks[1].textContent).to.eq('Block 0');
        expect(blocks[2].textContent).to.eq('Block 1');
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
      .trigger("mouseenter")
      .trigger("mousemove")
      .trigger("mouseleave");


    const dataTransfer = new DataTransfer();
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

    cy.get('.ce-toolbar__settings-btn').trigger('dragend', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .then((blocks) => {
        expect(blocks[0].textContent).to.eq('Block 2');
        expect(blocks[1].textContent).to.eq('Block 0');
        expect(blocks[2].textContent).to.eq('Block 1');
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
      .trigger("mouseenter")
      .trigger("mousemove")
      .trigger("mouseleave");

    const dataTransfer = new DataTransfer();
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
        // Dragover on target block little bit below the middle line.
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

    cy.get('.ce-toolbar__settings-btn')
      .trigger('dragend', { dataTransfer });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .then((blocks) => {
        expect(blocks[0].textContent).to.eq('Block 1');
        expect(blocks[1].textContent).to.eq('Block 2');
        expect(blocks[2].textContent).to.eq('Block 0');
      });
  });
});
