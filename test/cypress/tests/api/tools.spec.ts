import { ToolboxConfig, BlockToolData, ToolboxConfigEntry, InlineTool } from '../../../../types';

const ICON = '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"></path></svg>';

describe('Editor Tools Api', () => {
  context('Toolbox', () => {
    it('should render a toolbox entry for tool if configured', () => {
      /**
       * Tool with single toolbox entry configured
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries
         */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Entry 1',
            icon: ICON,
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 1);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool] .ce-popover__item-icon')
        .should('contain.html', TestTool.toolbox.icon);
    });

    it('should render several toolbox entries for one tool if configured', () => {
      /**
       * Tool with several toolbox entries configured
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
            },
            {
              title: 'Entry 2',
              icon: ICON,
            },
          ];
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 2);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .first()
        .should('contain.text', TestTool.toolbox[0].title);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .last()
        .should('contain.text', TestTool.toolbox[1].title);
    });

    it('should insert block with overriden data on entry click in case toolbox entry provides data overrides', () => {
      const text = 'Text';
      const dataOverrides = {
        testProp: 'new value',
      };

      /**
       * Tool with default data to be overriden
       */
      class TestTool {
        private _data = {
          testProp: 'default value',
        }

        /**
         * Tool contructor
         *
         * @param data - previously saved data
         */
        constructor({ data }) {
          this._data = data;
        }

        /**
         * Returns toolbox config as list of entries with overriden data
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
              data: dataOverrides,
            },
          ];
        }

        /**
         * Return Tool's view
         */
        public render(): HTMLElement {
          const wrapper = document.createElement('div');

          wrapper.setAttribute('contenteditable', 'true');

          return wrapper;
        }

        /**
         * Extracts Tool's data from the view
         *
         * @param el - tool view
         */
        public save(el: HTMLElement): BlockToolData {
          return {
            ...this._data,
            text: el.innerHTML,
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .last()
        .click()
        .type(text);

      cy.get('@editorInstance')
        .then(async (editor: any) => {
          const editorData = await editor.save();

          expect(editorData.blocks[0].data).to.be.deep.eq({
            ...dataOverrides,
            text,
          });
        });
    });

    it('should not display tool in toolbox if the tool has single toolbox entry configured and it has icon missing', () => {
      /**
       * Tool with one of the toolbox entries with icon missing
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries one of which has missing icon
         */
        public static get toolbox(): ToolboxConfig {
          return {
            title: 'Entry 2',
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('not.exist');
    });

    it('should skip toolbox entries that have no icon', () => {
      const skippedEntryTitle = 'Entry 2';

      /**
       * Tool with one of the toolbox entries with icon missing
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries one of which has missing icon
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
            },
            {
              title: skippedEntryTitle,
            },
          ];
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 1)
        .should('not.contain', skippedEntryTitle);
    });
  });
  context('InlineToolbox', () => {
    it('should show inline toolbox', () => {
      cy.createEditor({}).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-inline-toolbar')
        .should('not.have.class', 'ce-inline-toolbar--showed');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .first()
        .click()
        .type('Hello you')
        .type('{selectall}');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-inline-toolbar')
        .should('have.class', 'ce-inline-toolbar--showed');
    });

    it('should handle conditional inline tool correctly', () => {
      const textToStartWith = 'hello there';

      /**
       * Conditional inline tool for testing
       */
      class ConditionalTool implements InlineTool {
        public static isInline = true;
        public static title = 'conditioned';

        /**
         * @returns {HTMLElement}
         */
        public render(): HTMLElement {
          const button = document.createElement('button');

          button.innerHTML = ICON;

          return button;
        }

        /**
         * not needed
         *
         * @param range - selection range
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public surround(range: Range): void {
        }

        /**
         *
         * @param selection - selection to check
         * @returns {boolean}
         */
        public checkState(selection: Selection): boolean {
          return true;
        }

        /**
         * Function that allow user to create conditional tool
         *
         * @param selection - selection to validate
         * @returns {boolean}
         */
        public isValid(selection: Selection): boolean {
          return selection.toString().startsWith(textToStartWith);
        }
      }

      cy.createEditor({
        tools: {
          condition: ConditionalTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .first()
        .click()
        .type('Hello you')
        .type('{selectall}');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-inline-toolbar__buttons')
        .get('button[data-tool="condition"]')
        .should('not.be.visible');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .first()
        .click()
        .type('{enter}');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .last()
        .click()
        .type(textToStartWith + ' how are you')
        .type('{selectall}');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-inline-toolbar__buttons')
        .get('button[data-tool="condition"]')
        .should('be.visible');
    });
  });
});