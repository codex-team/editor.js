import { PopoverItemParams } from '../../../../types/index.js';

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
  public static get toolbox(): PopoverItemParams {
    return {
      icon: '₷',
      title: 'Some tool',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onActivate: (): void => {},
    };
  }

  /**
   * Extracts data from the plugin's UI
   */
  public save(): {data: string} {
    return {
      data: '123',
    };
  }
}

describe('Flipper', () => {
  it('should prevent plugins event handlers from being called while keyboard navigation', () => {
    const ARROW_DOWN_KEY_CODE = 40;
    const ENTER_KEY_CODE = 13;

    const sampleText = 'sample text';

    cy.createEditor({
      tools: {
        sometool: SomePlugin,
      },
      data: {
        blocks: [
          {
            type: 'sometool',
            data: {
            },
          },
        ],
      },
    });

    cy.spy(SomePlugin, 'pluginInternalKeydownHandler');

    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      .as('pluginInput')
      .focus()
      .type(sampleText)
      .wait(100);

    // Try to delete the block via keyboard
    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      // Open tunes menu
      .trigger('keydown', { code: 'Slash',
        ctrlKey: true })
      // Navigate to delete button (the second button)
      .trigger('keydown', { keyCode: ARROW_DOWN_KEY_CODE })
      .trigger('keydown', { keyCode: ARROW_DOWN_KEY_CODE });

    /**
     * Check whether we focus the Move Up Tune or not
     */
    cy.get('[data-item-name="move-up"]')
      .should('have.class', 'ce-popover-item--focused');

    cy.get('[data-cy=editorjs]')
      .get('.cdx-some-plugin')
      // Click delete
      .trigger('keydown', { keyCode: ENTER_KEY_CODE })
      // // Confirm delete
      .trigger('keydown', { keyCode: ENTER_KEY_CODE });

    expect(SomePlugin.pluginInternalKeydownHandler).to.have.not.been.called;
  });
});
