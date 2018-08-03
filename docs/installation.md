# Installation Guide

There are few steps to run CodeX Editor on your site.

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize Editor's instance](#create-editor-instance)

## Load Editor's core

Firstly you need to get CodeX Editor itself. It is a [minified script](../build/codex-editor.js) with minimal available  

Choose the most usable method of getting Editor for you.

- Node package
- Source from CDN
- Local file from project

### Node.js

Install the package via NPM or Yarn

```shell
npm i codex.editor --save-dev
```

Include module at your application 

```javascript
const CodexEditor = require('codex.editor');
```

### Use from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/codex.editor).

`https://cdn.jsdelivr.net/npm/codex.editor@2.0.0`

Then require this script.

```html
<script src="..."></script>
```

### Save sources to project

Copy [codex-editor.js](../build/codex-editor.js) file to your project and load it.

```html
<script src="codex-editor.js"></script>
```

## Load Tools

Each Block at the CodeX Editor represented by [Tools](tools.md). There are simple external scripts with own logic. For example check out our [Paragraph](https://github.com/codex-editor/paragraph) Tool that represents simple text block.

Each Tool should have an installation guide. You can install Paragraph Tool via the same ways as an Editor (Node.js, CDN, local file).

Check [CodeX Editor's community](https://github.com/codex-editor) to see Tools examples.

**Example:** use Paragragh from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.paragraph@2.0.3/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of CodeX Editor and pass [Configuration Object](../src/components/interfaces/editor-config.ts). 
Minimal params is a `holderId`, `tools` list and `initialBlock` marker.

```html
<div id="codex-editor"></div>
```

You can create a simple Editor only with a default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param.

```javascript
var editor = new CodexEditor('codex-editor');
````

Or pass a whole settings object.

```javascript
var editor = new CodexEditor({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'codex-editor',

    /**
     * What Block will be inserted by default
     */
    initialBlock : 'paragraph',

    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
        paragraph: {
          class: Paragraph,
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
