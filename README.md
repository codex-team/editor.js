<p align="center"><img src="https://capella.pics/3c0b525b-50d9-4720-8aad-9148114cfa6e.jpg"></p>

![](https://flat.badgen.net/badge/CodeX%20Editor/v2.0.8/blue?icon=npm)

## Version 2.0-beta is here!

We are glad to introduce the next version of CodeX Editor. Totally new core, structure and plugins — that was an impressive adventure 🤓.

Welcome to testing stage. Please, join a [public Telegram-chat](//t.me/codex_editor) where you always find a support.

## Documentation

While we develop the new Documentation Site with all stuff, you can check some available docs at the [docs/](docs/) dir.

- [Installation](docs/installation.md)
- [How to use](docs/usage.md)
- [How to create a Block Tool Plugin](docs/tools.md)
- [How to create an Inline Tool Plugin](docs/tools-inline.md)
- [API for Tools](src/components/interfaces/api.ts)

Sorry if we missed something. You can join a [Telegram-chat](//t.me/codex_editor) and ask a question.

---

# So how to use CodeX Editor

## Basics

CodeX Editor is a Block-Styled editor. Blocks is a structural units, of which the Entry is composed. 
For example, `Paragraph`, `Heading`, `Image`, `Video`, `List` are Blocks. Each Block is represented by a Plugin. 
We have [many](http://github.com/codex-editor) ready-to-use Plugins and the [simple API](docs/tools.md) for creation new ones.

So how to use the Editor after [Installation](docs/installation.md).

- Create new Blocks by Enter or with the Plus Button
- Press `TAB` or click on the Plus Button to view the Toolbox
- Press `TAB` again to leaf Toolbox and select a Block you need. Then press Enter.


 ![](https://github.com/codex-editor/list/raw/master/assets/example.gif)
 
- Select text fragment and apply a style or insert a link from the Inline Toolbar

![](https://capella.pics/7ccbcfcd-1c49-4674-bea7-71021468a1bd.jpg)

- Use «three-dots» button on the right to open Block Settings. From here, you can move and delete a Block 
or apply Tool's settings, if it provided. For example, set a Heading level or List style.

![](https://capella.pics/01a55381-46cd-47c7-b92e-34765434f2ca.jpg)    

## Shortcuts

We really appreciate shortcuts. So there are few presets. 

Action | Shortcut | Restrictions
-- | -- | --
`TAB` | Show/leaf a Toolbox. | On empty block
`SHIFT+TAB` | Leaf back a Toolbox. | While Toolbox is opened
`ENTER` | Create a Block | While Toolbox is opened and some Tool is selected
`CMD+B` | Bold style | On selection
`CMD+I` | Italic style | On selection
`CMD+K` | Insert a link | On selection
 
Also we support shortcuts on the all type of Tools. Specify a shortcut with the Tools configuration. For example:

```js
var editor = CodexEditor({
  //...
  tools: {
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H'
    },
    list: {
      class: List,
      shortcut: 'CMD+SHIFT+L'
    }
  }
  //...
 });

```


# Installation Guide

There are few steps to run CodeX Editor on your site.

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize Editor's instance](#create-editor-instance)

## Load Editor's core

Firstly you need to get CodeX Editor itself. It is a [minified script](build/codex-editor.js) with minimal available  

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

Copy [codex-editor.js](build/codex-editor.js) file to your project and load it.

```html
<script src="codex-editor.js"></script>
```

## Load Tools

Each Block at the CodeX Editor represented by [Tools](docs/tools.md). There are simple external scripts with own logic. Probably you want to use several Block Tools that should be connected.

For example check out our [Header](https://github.com/codex-editor/header) Tool that represents heading blocks.

You can install Header Tool by the same way as the Editor (Node.js, CDN, local file).

Check [CodeX Editor's community](https://github.com/codex-editor) to see more ready-to-use Tools.

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of CodeX Editor and pass [Configuration Object](src/components/interfaces/editor-config.ts) with `holderId` and tools list. 

```html
<div id="codex-editor"></div>
```

You can create a simple Editor with only default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param. Or use the default `codex-editor` id for wrapper.

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

Take a look at the [example.html](example/example.html) to view more detailed examples.




