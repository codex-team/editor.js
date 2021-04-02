# Tools for the Inline Toolbar

Similar with [Tools](tools.md) represented Blocks, you can create Block Tunes and connect it to particular Tool or for all Tools.

## Base structure

Tune's class should have a `isTune` property (static getter) set tu `true`.

Block Tune must implement render method which returns an HTML Element inserted to block settings.

- `render()` — create a button

Also, you can provide optional methods

- `wrap()` — wraps Block content with own HTML elements
- `save()` — save Tunes state on Editor's save

At the constructor of Tune's class exemplar you will receive an object with following parameters:

| Parameter | Description |
| --------- | ----------- |
| api  | Editor's [API](api.md) obejct |
| settings | Configuration of Block Tool Tune is connected to (might be useful in some cases) |
| block | [Block API](api.md#block-api) methods for block Tune is connected to |
| data | Saved Tune data |

---

### render(): HTMLElement

Method that returns button to append to the block settings area

#### Parameters

Method does not accept any parameters

#### Return value

type | description |
-- | -- |
`HTMLElement` | element that will be added to the block settings area |

---

### wrap(blockContent: HTMLElement): HTMLElement

Method that accepts Block's content and wrap it with your own layout.
Might be useful if you want to modify Block appearance.

```javascript
class Tune {
    wrap(blockContent) {
        const myWrapper = document.createElement('div');

        myWrapper.append(blockContent);

        return myWrapper;
    }
}
```

#### Parameters

name | type | description |
-- |-- | -- |
blockContent | HTMLElement | Block's content (might be wrapped by other Tunes) |

#### Return value

| type | description |
| -- | -- |
| HTMLElement | Your element that wraps block content |

---

### save()

Method should return Tune's state you want to save to Editor's output

#### Parameters

No parameters

#### Return value

type | description |
-- | -- |
`any` | any data you want to save |

---

### static prepare()

If you need to prepare some data for Tune (eg. load external script, create HTML nodes in the document, etc) you can use static prepare method.

It accepts tunes config passed on Editor's initialization as an argument:


```javascript
class Tune {
  static prepare(config) {
    loadScript();
    insertNodes();
    ...
  }
}
```

#### Parameters

type | description |
-- | -- |
`object` | your Tune configuration |


#### Return value

No return value

---

### static reset()

On Editor destroy you can use an opposite method `reset` to clean up all prepared data:

```javascript
class Tune {
  static reset() {
    cleanUpScripts();
    deleteNodes();
  ...
  }
}
```

#### Parameters

No parameters

#### Return value

No return value

---

#### Format

Tunes data is saved to `tunes` property of output object:

```
{
  blocks: [
    {
      type: 'paragraph',
      data: {
        text: 'This is paragraph with Tune'
      },
      tunes: {
        'my-tune-name': {},
        favorite: true,
        anchor: 'might be string'
      }
    }
  ]
}
```