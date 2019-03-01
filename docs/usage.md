# So how to use Editor.js

## Basics

Editor.js is a Block-Styled editor. Blocks is a structural units, of which the Entry is composed. 
For example, `Paragraph`, `Heading`, `Image`, `Video`, `List` are Blocks. Each Block is represented by a Plugin. 
We have [many](http://github.com/editor-js/) ready-to-use Plugins and the [simple API](tools.md) for creation new ones.

So how to use the Editor after [Installation](installation.md).

- Create new Blocks by Enter or with the Plus Button
- Press `TAB` or click on the Plus Button to view the Toolbox
- Press `TAB` again to leaf Toolbox and select a Block you need. Then press Enter.


 ![](https://github.com/editor-js/list/raw/master/assets/example.gif)
 
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
var editor = EditorJS({
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

## Autofocus

If you want to focus Editor after page has been loaded, you can enable autofocus by passing `autofocus` to the initial config


```js
var editor = EditorJS({
  //...
  autofocus: true
  //...
 });

```
