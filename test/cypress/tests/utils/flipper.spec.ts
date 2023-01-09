import { PopoverItem } from '../../../../types/index.js';

/**
 * Mock of some Block Tool
 */
class SomePlugin {
  /**
   * Event handler to be spied in test
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public static pluginInternalKeydownHandler(): void {}

  /**
   * Mocked render method
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');

    wrapper.classList.add('cdx-some-plugin');
    wrapper.contentEditable = 'true';
    wrapper.addEventListener('keydown', SomePlugin.pluginInternalKeydownHandler);

    return wrapper;
  }

  /**
   * Used to display our tool in the Toolbox
   */
  public static get toolbox(): PopoverItem {
    return {
      icon: '₷',
      title: 'Some tool',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onActivate: (): void => {},
    };
  }
}

describe('Flipper', () => {
  beforeEach(function () {
    cy.createEditor({
      tools: {
        sometool: SomePlugin,
      },
    }).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  it('should prevent plugins event handlers from being called while keyboard navigation', () => {
    const TAB_KEY_CODE = 9;
    const ARROW_DOWN_KEY_CODE = 40;
    const ENTER_KEY_CODE = 13;

    const sampleText = 'sample text';

    cy.spy(SomePlugin, 'pluginInternalKeydownHandler');

    // Insert sometool block and enter sample text
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .trigger('keydown', { keyCode: TAB_KEY_CODE });

    cy.get('[data-item-name=sometool]').click();

    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      .focus()
      .type(sampleText);

    // Try to delete the block via keyboard
    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      // Open tunes menu
      .trigger('keydown', { keyCode: TAB_KEY_CODE })
      // Navigate to delete button (the second button)
      .trigger('keydown', { keyCode: ARROW_DOWN_KEY_CODE })
      .trigger('keydown', { keyCode: ARROW_DOWN_KEY_CODE });

    /**
     * Check whether we focus the Delete Tune or not
     */
    cy.get('[data-item-name="delete"]')
      .should('have.class', 'ce-popover__item--focused');

    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      // Click delete
      .trigger('keydown', { keyCode: ENTER_KEY_CODE })
      // // Confirm delete
      .trigger('keydown', { keyCode: ENTER_KEY_CODE });

    expect(SomePlugin.pluginInternalKeydownHandler).to.have.not.been.called;
  });
});
