# Installation Guide

There are a few steps to run CodeX Editor on your site.

## Load Editor's core

> Installation via NPM/Yarn will be added soon.

Copy [codex-editor.js](../build/codex-editor.js) file to your project and load it.

```html
<script src="codex-editor.js"></script>
```

## Load external Tools

Load Tools with their classes and styles.

[Text](../example/plugins/text/) tool for an example.

```html
<script src="text/text.js"></script>
<link rel="stylesheet" href="text/text.css">
```

Check out directories [plugins](../example/plugins/) and [tools-inline](../example/tools-inline/) to see Tools made by us.

## Create Editor instance

Create a new variable with an instance of Editor and pass initial params [object](../src/components/interfaces/editor-config.ts).


```javascript
var editor = new CodexEditor({
    /**
     * ID of element which will be used as a holder for Editor
     */
    holderId : 'codex-editor',

    /**
     * Block-tool name which used to
     */
    initialBlock : 'text',

    /**
     * Default Tool for a new block
     */
    tools: {
        text: Text,
    },

    /**
     * Tools params
     */
    toolsConfig: {
        text: {
          inlineToolbar : true
        },
    },

    /**
     * Data to be loaded to Editor
     */
    data: {}
});
```

## Saving Data from Editor

Use module Saver's function `save()` to get a promise with data from Editor.

```javascript
editor.saver.save()
  .then((savedData) => {
    console.log(savedData);
  });
```  

## Render new data

Run function `render()` from module Blocks to reload Editor with a new data.

Passed object should implements [IInputOutputData](../src/components/interfaces/input-output-data.ts) interface.

```javascript
editor.blocks.render({
  items: [
    {
      type : 'text',
      data : {
        text : 'Hello from CodeX Team!'
      }
    }
  ],
});
```  

## Example

Check out our [example page](../example/example.html).
