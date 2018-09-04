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

Each Block at the CodeX Editor represented by [Tools](tools.md). There are simple external scripts with own logic. Probably you want to use several Block Tools that should be connected.

For example check out our [Header](https://github.com/codex-editor/header) Tool that represents heading blocks.

You can install Header Tool via the same ways as an Editor (Node.js, CDN, local file).

Check [CodeX Editor's community](https://github.com/codex-editor) to see Tools examples.

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of CodeX Editor and pass [Configuration Object](../src/components/interfaces/editor-config.ts). 

Minimal params is a `holderId`, `tools` list and `initialBlock` marker.

```html
<div id="codex-editor"></div>
```

You can create a simple Editor only with a default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param or use default `codex-editor`.

```javascript
var editor = new CodexEditor(); /** Zero-configuration */

// equals

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
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
        header: {
          class: Header,
          inlineToolbar : true
        },
        // ...
    },

    /**
     * What Block will be inserted by default
     */
    initialBlock : 'paragraph',

    /**
     * Previously saved data that should be rendered
     */
    data: {}
});
```

## Ready callback

CodeX Editor needs a bit time to initialize. It is an asynchronous action so it won't block execution of your main script.

If you need to know when editor instance is ready you can use one of following ways:

##### Pass `onReady` property to the configuration object. 

It must be a function:

```javascript
var editor = new CodexEditor({
   // Other configuration properties

   /**
    * onReady callback
    */
   onReady: () => {console.log('CodeX Editor is ready to work!')}
});
```

#### Use `isReady` promise.

After you create new `CodexEditor` object it contains `isReady` property.
It is a Promise object resolved when editor is ready to work and rejected otherwise.
If there is an error during initialization `isReady` promise will be rejected with error message.

```javascript
var editor = new CodexEditor();

editor.isReady
  .then(() => {
    /** Do anything you need after editor initialization */
  })
  .catch((reason) => {
    console.log(`CodeX Editor initialization failed because of ${reason}`)
  });
```

You can use `async/await` to keep your code looking synchronous:

```javascript
var editor = new CodexEditor();

try {
  await editor.isReady;
  /** Do anything you need after editor initialization */
} catch (reason) {
  console.log(`CodeX Editor initialization failed because of ${reason}`)
}
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
