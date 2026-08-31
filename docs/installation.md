# Installation Guide

There are three steps to run Editor.js on your site:

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize the Editor instance](#create-editor-instance)

## Load Editor's core

First, choose how you want to load Editor.js. Use either a package manager, a CDN, or a local copy of the built file.

### Use a package manager

Install Editor.js with NPM or Yarn:

```shell
npm i @editorjs/editorjs
```

Then import it into your application:

```javascript
import EditorJS from '@editorjs/editorjs';
```

This method requires a JavaScript project that supports package imports, usually through a build tool or bundler.

### Use from CDN

For a browser-only project, load Editor.js directly with a script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
```

After the script loads, `EditorJS` is available as a global variable. Do not also use the package-manager import in the same setup.

```html
<div id="editorjs"></div>

<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
<script>
  const editor = new EditorJS({
    holder: 'editorjs'
  });
</script>
```

### Save the built file to your project

You can also download a built browser file from the package's `dist` directory and save it in your project. Load the file with a script tag before creating the Editor.js instance:

```html
<script src="editorjs.umd.js"></script>
```

## Load Tools

Each Block at the Editor.js represented by [Tools](tools.md). There are simple external scripts with their own logic. You'll probably want to use several Block Tools that should be connected.

For example, check out our [Header](https://github.com/editor-js/header) Tool that represents heading blocks.

You can install the Header Tool via the same ways as an Editor (Node.js, CDN, local file).

Check [Editor.js's community](https://github.com/editor-js/) to see Tools examples.

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.1.0/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of Editor.js and pass [Configuration Object](../src/types-internal/editor-config.ts).
At least the `holder` option is required.

```html
<div id="editorjs"></div>
```

You can create a simple Editor only with a default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param or use default `editorjs`.

```javascript
var editor = new EditorJS(); /** Zero-configuration */

// equals

var editor = new EditorJS('editorjs');
```

Or pass a whole settings object.

```javascript
var editor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holder : 'editorjs',

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
     * Previously saved data that should be rendered
     */
    data: {}
});
```

## Ready callback

Editor.js needs a bit of time to initialize. It is an asynchronous action so it won't block execution of your main script.

If you need to know when the editor instance is ready you can use one of the following ways:

##### Pass `onReady` property to the configuration object.

It must be a function:

```javascript
var editor = new EditorJS({
   // Other configuration properties

   /**
    * onReady callback
    */
   onReady: () => {console.log('Editor.js is ready to work!')}
});
```

#### Use `isReady` promise.

After you create a new `EditorJS` object it will contain `isReady` property.
It is a Promise object that resolves when the editor will be ready to work and rejected otherwise.
If there is an error during initialization `isReady` promise will be rejected with an error message.

```javascript
var editor = new EditorJS();

editor.isReady
  .then(() => {
    /** Do anything you need after editor initialization */
  })
  .catch((reason) => {
    console.log(`Editor.js initialization failed because of ${reason}`)
  });
```

You can use `async/await` to keep your code looking synchronous:

```javascript
var editor = new EditorJS();

try {
  await editor.isReady;
  /** Do anything you need after editor initialization */
} catch (reason) {
  console.log(`Editor.js initialization failed because of ${reason}`)
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

## Features

Also, Editor.js provides useful methods to work with Editor's state.

```javascript
var editor = new EditorJS({
   // Other configuration properties

   /**
    * onReady callback
    */
   onReady: () => {console.log('Editor.js is ready to work!')},

   /**
    * onChange callback
    * Accepts CustomEvent describing what happened
    */
   onChange: (editorAPI, event) => {console.log('Now I know that Editor\'s content changed!')}
});
```

## Example

Take a look at the [example.html](../example/example.html) to view more detailed examples.
