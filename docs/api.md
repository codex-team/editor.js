# CodeX Editor API

Blocks have access to the public methods provided by CodeX Editor API Module. Plugin and Tune Developers
can use Editor API as they want.

## Api object description

Common API interface.

```js
export interface IAPI {
   blocks: IBlocksAPI;
   caret: ICaretAPI;
   sanitizer: ISanitizerAPI;
   toolbar: IToolbarAPI;
 }
 ```

#### IBlocksAPI

Methods that working with Blocks

```swap(fromIndex, toIndex)``` - swaps two Blocks by their positions

```delete(blockIndex?: Number)``` - deletes Block with passed index

```getCurrentBlockIndex()``` - current Block index

```getBlockByIndex(index: Number)``` - returns Block with passed index

```getBlocksCount()``` - returns Blocks count

```stretchBlock(index: number, status: boolean)``` - make Block stretched

```insertNewBlock()``` - insert new Block after working place

```getSanitizerConfig()``` - method return allowed inline-tool's sanitizer rules

#### ISanitizerAPI

```clean(taintString, config)``` - method uses HTMLJanitor to clean taint string.
CodeX Editor provides basic config without attributes, but you can inherit by passing your own config.

If Tool enables inline-tools, we get it's sanitizing rules and merge with your passed custom
rules.

Usage:

```js
let taintString = '<div><p style="font-size: 5em;"><b></b>BlockWithText<a onclick="void(0)"></div>'
let customConfig = {
  b: true,
  p: {
    style: true,
  },
}
this.api.sanitizer.clean(taintString, customConfig);
```

### IToolbarAPI

Methods that working with Toolbar

```open()``` - Opens toolbar

```close()``` - Closes toolbar, toolbox and blockSettings if they are opened

### IEventsAPI

Methods that allows to subscribe on CodeX Editor events

```on(eventName: string, callback: Function)``` - subscribe callback on event

```off(eventName: string, callback: Function)``` - unsubscribe callback from event

```emit(eventName: string, data: object)``` - fires all subscribed callbacks with passed data

### IListenerAPI

Methods that allows to work with DOM listener. Useful when you forgot to remove listener.
Module collects all listeners and destroys automatically

```on(element: HTMLElement, eventType: string, handler: Function, useCapture?: boolean)``` - add event listener to HTML element

```off(element: HTMLElement, eventType: string, handler: Function)``` - remove event handler from HTML element


### Destroy API
If there are necessity to remove CodeX Editor instance from the page you can use `destroy()` method.

It makes following steps:
1. Clear the holder element by setting it\`s innerHTML to empty string
2. Remove all event listeners related to CodeX Editor
3. Delete all properties from instance object and set it\`s prototype to `null`

After executing the `destroy` method, editor inctance becomes an empty object. This way you will free occupied JS Heap on your page.
