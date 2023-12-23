import ToolMock from '../../../fixtures/tools/ToolMock';

/**
 * Mock of tool that contains two inputs
 */
class ToolWithTwoInputs extends ToolMock {
  /**
   * Create element with two inputs
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');
    const input1 = document.createElement('div');
    const input2 = document.createElement('div');

    input1.contentEditable = 'true';
    input2.contentEditable = 'true';

    wrapper.setAttribute('data-cy', 'tool-with-two-inputs');

    wrapper.appendChild(input1);
    wrapper.appendChild(input2);

    return wrapper;
  }
}

/**
 * Mock of tool without inputs
 */
class ContentlessTool extends ToolMock {
  public static contentless = true;
  /**
   * Create element without inputs
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');

    wrapper.setAttribute('data-cy', 'contentless-tool');

    wrapper.textContent = '***';

    return wrapper;
  }
}

/**
 * Time to wait for caret to finish moving
 */
const CARET_MOVE_TIME = 100;

describe('Tab keydown', function () {
  it('should focus next Block if Block contains only one input', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'first paragraph',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .click()
      .trigger('keydown', { keyCode: 9 })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .then(($secondBlock) => {
        const editorWindow = $secondBlock.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);

        /**
         * Check that second block contains range
         */
        expect(range.startContainer.parentElement).to.equal($secondBlock.get(0));
      });
  });

  it('should focus next input if Block contains several inputs', () => {
    cy.createEditor({
      tools: {
        toolWithTwoInputs: {
          class: ToolWithTwoInputs,
        },
      },
      data: {
        blocks: [
          {
            type: 'toolWithTwoInputs',
            data: {},
          },
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=tool-with-two-inputs]')
      .find('[contenteditable=true]')
      .first()
      .click()
      .trigger('keydown', { keyCode: 9 })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=tool-with-two-inputs]')
      .find('[contenteditable=true]')
      .last()
      .then(($secondInput) => {
        const editorWindow = $secondInput.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);

        /**
         * Check that second block contains range
         */
        expect(range.startContainer).to.equal($secondInput.get(0));
      });
  });

  it('should highlight next Block if it does not contain any inputs (contentless Block)', () => {
    cy.createEditor({
      tools: {
        contentlessTool: {
          class: ContentlessTool,
        },
      },
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
          {
            type: 'contentlessTool',
            data: {},
          },
          {
            type: 'paragraph',
            data: {
              text: 'third paragraph',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .click()
      .trigger('keydown', { keyCode: 9 })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=contentless-tool]')
      .parents('.ce-block')
      .should('have.class', 'ce-block--selected');
  });

  it('should focus next input after Editor when pressed in last Block', () => {
    cy.createEditor({});

    /**
     * Add regular input after Editor
     */
    cy.window()
      .then((window) => {
        const input = window.document.createElement('input');

        input.setAttribute('data-cy', 'regular-input');

        window.document.body.appendChild(input);
      });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .tab();

    cy.get('[data-cy=regular-input]')
      .should('have.focus');
  });
});

describe('Shift+Tab keydown', function () {
  it('should focus previous Block if Block contains only one input', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'first paragraph',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .click()
      .trigger('keydown', {
        keyCode: 9,
        shiftKey: true,
      })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .then(($firstBlock) => {
        const editorWindow = $firstBlock.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);

        /**
         * Check that second block contains range
         */
        expect(range.startContainer.parentElement).to.equal($firstBlock.get(0));
      });
  });

  it('should focus previous input if Block contains several inputs', () => {
    cy.createEditor({
      tools: {
        toolWithTwoInputs: {
          class: ToolWithTwoInputs,
        },
      },
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
          {
            type: 'toolWithTwoInputs',
            data: {},
          },
        ],
      },
    });

    cy.get('[data-cy=tool-with-two-inputs]')
      .find('[contenteditable=true]')
      .last()
      .click()
      .trigger('keydown', {
        keyCode: 9,
        shiftKey: true,
      })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=tool-with-two-inputs]')
      .find('[contenteditable=true]')
      .first()
      .then(($firstInput) => {
        const editorWindow = $firstInput.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);

        /**
         * Check that second block contains range
         */
        expect(range.startContainer).to.equal($firstInput.get(0));
      });
  });

  it('should highlight previous Block if it does not contain any inputs (contentless Block)', () => {
    cy.createEditor({
      tools: {
        contentlessTool: {
          class: ContentlessTool,
        },
      },
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'second paragraph',
            },
          },
          {
            type: 'contentlessTool',
            data: {},
          },
          {
            type: 'paragraph',
            data: {
              text: 'third paragraph',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .click()
      .trigger('keydown', {
        keyCode: 9,
        shiftKey: true,
      })
      .wait(CARET_MOVE_TIME);

    cy.get('[data-cy=contentless-tool]')
      .parents('.ce-block')
      .should('have.class', 'ce-block--selected');
  });

  it('should focus previous input before Editor when pressed in first Block', () => {
    cy.createEditor({});

    /**
     * Add regular input before Editor
     */
    cy.window()
      .then((window) => {
        const input = window.document.createElement('input');

        input.setAttribute('data-cy', 'regular-input');

        window.document.body.insertBefore(input, window.document.body.firstChild);
      });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .tab({ shift: true });

    cy.get('[data-cy=regular-input]')
      .should('have.focus');
  });
});
