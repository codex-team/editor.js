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
    });

    afterEach(function () {
        if (this.editorInstance) {
            this.editorInstance.destroy();
        }
    });
});
