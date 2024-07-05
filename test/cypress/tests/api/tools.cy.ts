import { ToolboxConfig, BlockToolData, ToolboxConfigEntry, PasteConfig } from '../../../../types';
import EditorJS from '../../../../types';
import { HTMLPasteEvent, TunesMenuConfig } from '../../../../types/tools';

/* eslint-disable @typescript-eslint/no-empty-function */

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
        .get('.ce-popover-item[data-item-name=testTool]')
        .should('have.length', 1);

      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item[data-item-name=testTool] .ce-popover-item__icon')
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
        .get('.ce-popover-item[data-item-name=testTool]')
        .should('have.length', 2);

      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item[data-item-name=testTool]')
        .first()
        .should('contain.text', TestTool.toolbox[0].title);

      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item[data-item-name=testTool]')
        .last()
        .should('contain.text', TestTool.toolbox[1].title);
    });

    it('should insert block with overridden data on entry click in case toolbox entry provides data overrides', () => {
      const text = 'Text';
      const dataOverrides = {
        testProp: 'new value',
      };

      /**
       * Tool with default data to be overridden
       */
      class TestTool {
        private _data = {
          testProp: 'default value',
        };

        /**
         * Tool constructor
         *
         * @param data - previously saved data
         */
        constructor({ data }) {
          this._data = data;
        }

        /**
         * Returns toolbox config as list of entries with overridden data
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
        .get('.ce-popover-item[data-item-name=testTool]')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .last()
        .click()
        .type(text);

      cy.get('@editorInstance')
        .then(async (editor: unknown) => {
          const editorData = await (editor as EditorJS).save();

          expect(editorData.blocks[0].data).to.be.deep.eq({
            ...dataOverrides,
            text,
          });
        });
    });
  });

  context('Tunes — renderSettings()', () => {
    it('should contain a single block tune configured in tool\'s renderSettings() method', () => {
      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): TunesMenuConfig {
          return {
            label: 'Test tool tune',
            icon: ICON,
            name: 'testToolTune',

            onActivate: (): void => { },
          };
        }

        /** Save method stub */
        public save(): void { }

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
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

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect preconfigured tune to exist in tunes menu
      cy.get('[data-item-name=testToolTune]').should('exist');
    });

    it('should contain multiple block tunes if configured in tool\'s renderSettings() method', () => {
      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): TunesMenuConfig {
          return [
            {
              label: 'Test tool tune 1',
              icon: ICON,
              name: 'testToolTune1',

              onActivate: (): void => { },
            },
            {
              label: 'Test tool tune 2',
              icon: ICON,
              name: 'testToolTune2',

              onActivate: (): void => { },
            },
          ];
        }

        /** Save method stub */
        public save(): void { }

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
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

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect preconfigured tunes to exist in tunes menu
      cy.get('[data-item-name=testToolTune1]').should('exist');
      cy.get('[data-item-name=testToolTune2]').should('exist');
    });

    it('should contain block tunes represented as custom html if so configured in tool\'s renderSettings() method', () => {
      const sampleText = 'sample text';

      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): HTMLElement {
          const element = document.createElement('div');

          element.textContent = sampleText;

          return element;
        }

        /** Save method stub */
        public save(): void { }

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
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

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect preconfigured custom html tunes to exist in tunes menu
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover')
        .should('contain.text', sampleText);
    });

    it('should support label alias', () => {
      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): TunesMenuConfig {
          return [
            {
              icon: ICON,
              name: 'testToolTune1',
              onActivate: (): void => {},

              // Set text via title property
              title: 'Test tool tune 1',
            },
            {
              icon: ICON,
              name: 'testToolTune2',
              onActivate: (): void => {},

              // Set test via label property
              label: 'Test tool tune 2',
            },
          ];
        }

        /** Save method stub */
        public save(): void {}

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
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

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect both tunes to have correct text
      cy.get('[data-item-name=testToolTune1]').contains('Test tool tune 1');
      cy.get('[data-item-name=testToolTune2]').contains('Test tool tune 2');
    });
  });

  /**
   * @todo cover all the pasteConfig properties
   */
  context('Paste — pasteConfig()', () => {
    context('tags', () => {
      /**
       * tags: ['H1', 'H2']
       */
      it('should use corresponding tool when the array of tag names specified', () => {
        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestImgTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [ 'img' ], // only tag name specified. Attributes should be sanitized
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
          }
        }

        const toolsOnPaste = cy.spy(TestImgTool.prototype, 'onPaste');

        cy.createEditor({
          tools: {
            testTool: TestImgTool,
          },
        }).as('editorInstance');

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<img>',
          })
          .then(() => {
            expect(toolsOnPaste).to.be.called;
          });
      });

      /**
       * tags: ['img'] -> <img>
       */
      it('should sanitize all attributes from tag, if only tag name specified ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestImageTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [ 'img' ], // only tag name specified. Attributes should be sanitized
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestImageTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testImageTool: TestImageTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<img src="foo" onerror="alert(123)"/>', // all attributes should be sanitized
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('img');
            expect(pastedElement.attributes.length).eq(0);
          });
      });

      /**
       * tags: ['OL','LI',]
       * -><ol>
       * <li></li>
       * <li></li>
       * </ol>
       */
      it('should sanitize all attributes from tags, even if tag names specified in uppercase', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestListTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: ['OL', 'LI'], // tag names specified in upper case
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('ol');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestListTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testListTool: TestListTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<ol start="50"><li>Orderd List</li><li>Unorderd List</li></ol>', // all attributes should be sanitized, <li> should be preserved
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('ol');
            expect(pastedElement.attributes.length).eq(0);
            // check number of children
            expect(pastedElement.children.length).eq(2);

            /**
             * Check that all children are <li> tags
             */
            pastedElement.childNodes.forEach((child) => {
              expect(child.tagName.toLowerCase()).eq('li');
              expect(child.attributes.length).eq(0);
            });
          });
      });

      /**
       * tags: [{
       *   img: {
       *     src: true
       *   }
       * }]
       *   ->  <img src="">
       *
       */
      it('should leave attributes if entry specified as a sanitizer config ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestImageTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                {
                  img: {
                    src: true,
                  },
                },
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestImageTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testImageTool: TestImageTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<img src="foo" onerror="alert(123)"/>',
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;

            /**
             * Check that the <img> has only "src" attribute
             */
            expect(pastedElement.tagName.toLowerCase()).eq('img');
            expect(pastedElement.getAttribute('src')).eq('foo');
            expect(pastedElement.attributes.length).eq(1);
          });
      });

      /**
       * tags: [
       *   'video',
       *   {
       *     source: {
       *       src: true
       *     }
       *   }
       * ]
       */
      it('should support mixed tag names and sanitizer config ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                'video', // video should not have attributes
                {
                  source: { // source should have only src attribute
                    src: true,
                  },
                },
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('video');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<video width="100"><source src="movie.mp4" type="video/mp4"></video>',
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;

            /**
             * Check that <video>  has no attributes
             */
            expect(pastedElement.tagName.toLowerCase()).eq('video');
            expect(pastedElement.attributes.length).eq(0);

            /**
             * Check that the <source> has only 'src' attribute
             */
            expect(pastedElement.firstChild.tagName.toLowerCase()).eq('source');
            expect(pastedElement.firstChild.getAttribute('src')).eq('movie.mp4');
            expect(pastedElement.firstChild.attributes.length).eq(1);
          });
      });

      /**
       * tags: [
       *   {
       *     td: { width: true },
       *     tr: { height: true }
       *   }
       * ]
       */
      it('should support config with several keys as the single entry', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                {
                  video: {
                    width: true,
                  },
                  source: {
                    src: true,
                  },
                },
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('video');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<video width="100"><source src="movie.mp4" type="video/mp4"></video>',
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('video');

            /**
             * Check that the <tr> has the 'height' attribute
             */
            expect(pastedElement.firstChild.tagName.toLowerCase()).eq('source');
            expect(pastedElement.firstChild.getAttribute('src')).eq('movie.mp4');
          });
      });

      /**
       * It covers a workaround HTMLJanitor bug with tables (incorrect sanitizing of table.innerHTML)
       * https://github.com/guardian/html-janitor/issues/3
       */
      it('should correctly sanitize Table structure (test for HTMLJanitor bug)', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                'table',
                'tbody',
                {
                  td: {
                    width: true,
                  },
                  tr: {
                    height: true,
                  },
                },
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void { }

          /** save is required for correct implementation of the BlockTool class */
          public save(): void { }

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('tbody');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text/html': '<table><tr height="50"><td width="300">Ho-Ho-Ho</td></tr></table>',
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('table');

            /**
             * Check that the <tr> has the 'height' attribute
             */
            expect(pastedElement.querySelector('tr')).not.to.be.undefined;
            expect(pastedElement.querySelector('tr').getAttribute('height')).eq('50');

            /**
             * Check that the <td> has the 'width' attribute
             */
            expect(pastedElement.querySelector('td')).not.to.be.undefined;
            expect(pastedElement.querySelector('td').getAttribute('width')).eq('300');
          });
      });
    });
  });
});
