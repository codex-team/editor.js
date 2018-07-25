# Installation Guide

There are few steps to run CodeX Editor on your site.

## Load Editor's core

> Installation via NPM/Yarn will be added soon.

Copy [codex-editor.js](../build/codex-editor.js) file to your project and load it.

```html
<script src="codex-editor.js"></script>
```

## Load Block Tools

Each Block at the CodeX Editor represented by [Tools](tools.md). There are simple (or powerful) external scripts with own logic. To start using the Editor, you should connect minimum number of Tools.

[Text](../example/plugins/text/) tool for an example.

```html
<script src="text/text.js"></script>
<link rel="stylesheet" href="text/text.css">
```

Check out [example/plugins](../example/plugins/) and [example/tools-inline](../example/tools-inline/) directories to see Tools examples.

## Create Editor instance

Create an instance of CodeX Editor and pass [Configuration Object](../src/components/interfaces/editor-config.ts). 
Minimal params is a `holderId`, `tools` list and `initialBlock` marker.

```html
<div id="codex-editor"></div>
```

```javascript
var editor = new CodexEditor({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'codex-editor',

    /**
     * What Block will be inserted by default
     */
    initialBlock : 'text',

    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     * 
     */
    tools: {
        text: {
          class: Text,
          inlineToolbar : true
        },
        // ...
    },

    /**
     * Previously saved data that should be rendered
     */
    data: {}
});
```

## Saving Data

Call `editor.saver.save()` and handle returned Promise with saved data.

```javascript
editor.saver.save()
  .then((savedData) => {
    console.log(savedData);
  });
```  

## Example

Take a look at the [example.html](../example/example.html) to view more detailed examples.
