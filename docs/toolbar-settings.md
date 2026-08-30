# Editor.js Toolbar Block Settings Module

Toolbar Module has space for Block settings. Settings divided into:
 - space for plugin's settings, that is described by «Plugin»'s Developer
 - space for default settings. This option is also can be implemented and expanded

They difference between zones is that the first option is specified by plugin
and each Block can have different options, when second option is for every Block
regardless to the plugin's option.

### Let's look the examples:

Block Tool developers can implement the `renderSettings()` method to return a
[Menu Config](https://editorjs.io/menu-config/) object or an array of Menu
Config items. Editor.js renders each item and calls its `onActivate` callback
when the item is selected.

```js
renderSettings() {
  return [
    {
      title: 'Add border',
      icon: '<svg>...</svg>',
      isActive: this.data.withBorder,
      toggle: true,
      onActivate: () => {
        this.data.withBorder = !this.data.withBorder;
      },
    },
  ];
}
```

For custom controls, `renderSettings()` can still return an `HTMLElement`.
When using custom HTML, the Tool is responsible for rendering the controls and
handling their events. For more information, read [Tools](tools.md).

---

«Tune»'s Developers need to implement core-provided interface to develop
tunes that will be appeared in Toolbar default settings zone.

Tunes must expand two important methods:
 - `render()` - returns HTML and it is appended to the default settings zone
 - `save()` - extracts important information to be saved

No restrictions. Handle user action by yourself

Create Class that implements block-tune.ts

Your Tune's constructor gets argument as object and it includes:
 - {Object} api - object contains public methods from modules. @see [API](api.md)
 - {Object} settings - settings contains block default state.
This object could have information about cover, anchor and so on.

Example on TypeScript:

```js

import IBlockTune from './block-tune';

export default class YourCustomTune implements IBlockTune {

  public constructor({api, settings}) {
    this.api = api;
    this.settings = settings;
  }

  render() {
    let someHTML = '...';
    return someHTML;
  }

  save() {
    // Return the important data that needs to be saved
    return object
  }

  someMethod() {
    // moves current block down
    this.api.blocks.moveDown();
  }
}
```

Example on ES6

```js
export default class YourCustomTune {

  constructor({api, settings}) {
    this.api = api;
    this.settings = settings;
  }

  render() {
    let someHTML = '...';
    return someHTML;
  }

  save() {
    // Return the important data that needs to be saved
    return object
  }

  someMethod() {
    // moves current block down
    this.api.blocks.moveDown();
  }
}
```
