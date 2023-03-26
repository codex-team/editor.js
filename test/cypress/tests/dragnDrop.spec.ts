import Header from "@editorjs/header";
import Image from "@editorjs/simple-image";
import * as _ from "../../../src/components/utils";
import 'cypress-file-upload';

describe("Drag and drop the block of Editor", function () {
    beforeEach(function () {
        cy.createEditor({
            tools: {
                header: Header,
                image: Image,
            },
        }).as("editorInstance");

        const numberOfBlocks = 5;
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
    it("should drop file", function () {
        // Read file locally
        cy.readFile('example/assets/codex2x.png', 'base64').then((base64) => {
            // Create URI
            const uri = 'data:image/png;base64,' + base64;
            // Test by dropping the image.
            cy.get("[data-cy=editorjs]")
                .get('div.ce-block')
                .last()
                .attachFile('../../../example/assets/codex2x.png', { subjectType: 'drag-n-drop' })
                .wait(10);

            cy.get('[data-cy=editorjs]')
                // In Edge test are performed slower, so we need to 
                // increase timeout to wait until image is loaded on the page
                .get('img', { timeout: 10000 })
                .should('have.attr', 'src', uri);
        })
    });

    // it("should drag the block", function () {

    //     cy.get('[data-cy=editorjs]')
    //         .get('div.ce-block')
    //         .first()
    //         .click();

    //     const dataTransfer = new DataTransfer();
    //     cy.get('.ce-toolbar__settings-btn')
    //         .trigger("dragstart", { dataTransfer });
    //     cy.get('[data-cy=editorjs]')
    //         .get('div.ce-block')
    //         .eq(2)
    //         .trigger("dragenter").then((e) => {
    //             const bbox = e[0].getBoundingClientRect();
    //             cy.get('[data-cy=editorjs]')
    //                 .get('div.ce-block')
    //                 .eq(2)
    //                 .trigger("dragover", { clientX: bbox.x, clientY: (bbox.y + (bbox.width / 2 - 20)) })
    //                 .trigger("drop", { dataTransfer });
    //         })
    //     // .invoke('attr', 'class') // returns "class1 class2 class3"
    //     // .then(classList => {
    //     //     console.log(classList);
    //     // });


    //     // cy.get('.ce-toolbar__settings-btn')
    //     //     .trigger("dragend", { dataTransfer });
    // });
});
