# Tools for the Inline Toolbar

Similar with [Tools](tools.md) represented Blocks, you can create Tools for the Inline Toolbar. It will work with 
selected fragment of text. The simplest example is `bold` or `italic` Tools.

## Base structure

First of all, Tool's class should have a `isInline` property (static getter) set as `true`. 

After that Inline Tool should implement next methods.

- `render()` — create a button
- `surround()` — works with selected range
- `checkState()` — get Tool's activated state by selected range

Also, you can provide optional methods

- `renderActions()` — create additional element below the buttons
- `clear()` — clear Tool's stuff on opening/closing of Inline Toolbar
- `sanitize()` — sanitizer configuration

At the constructor of Tool's class exemplar you will accept an object with the [API](api.md) as a parameter.

---

### render()

Method that returns button to append at the Inline Toolbar

#### Parameters

Method does not accept any parameters

#### Return value

type | description | 
-- | -- |
`HTMLElement` | element that will be added to the Inline Toolbar |

---

### surround(range: Range)

Method that accepts selected range and wrap it somehow

#### Parameters

name | type | description | 
-- |-- | -- |
range | Range | first range of current Selection |

#### Return value

There is no return value

---

### checkState(selection: Selection)

Get Selection and detect if Tool was applied. For example, after that Tool can highlight button or show some details.

#### Parameters

name | type | description | 
-- |-- | -- |
selection | Selection | current Selection |

#### Return value

type | description | 
-- | -- |
`Boolean` | `true` if Tool is active, otherwise `false` |

---

### renderActions()

Optional method that returns additional Element with actions. 
For example, input for the 'link' tool or textarea for the 'comment' tool. 
It will be places below the buttons list at Inline Toolbar.

#### Parameters

Method does not accept any parameters

#### Return value

type | description | 
-- | -- |
`HTMLElement` | element that will be added to the Inline Toolbar |

---

### clear()

Optional method that will be called on opening/closing of Inline Toolbar. 
Can contain logic for clearing Tool's stuff, such as inputs, states and other.

#### Parameters

Method does not accept any parameters

#### Return value

Method should not return a value. 

### static get sanitize()

We recommend to specify the Sanitizer config that corresponds with inline tags that is used by your Tool. 
In that case, your config will be merged with sanitizer configuration of Block Tool 
that is using the Inline Toolbar with your Tool.

Example:

If your Tool wrapps selected text with `<b>` tag, the sanitizer config should looks like this:

```js
static get sanitize() {
  return {
    b: {} // {} means clean all attributes. true — leave all attributes
  }
}
``` 

Read more about Sanitizer configuration at the [Tools#sanitize](tools.md#sanitize)

### Specifying a title

You can pass your Tool's title via `title` static getter. It can be used, for example, in the Tooltip with 
icon description that appears by hover. 

```ts
export default class BoldInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title: string = 'Bold';

  // ... other methods
}
```
