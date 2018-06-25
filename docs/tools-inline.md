# Tools for the Inline Toolbar

Similar with [Tools](tools.md) represented Blocks, you can create Tools for the Inline Toolbar. It will work with 
selected fragment of text. The simplest example is `bold` or `italic` Tools.

## Base structure

Inline Tool should implement next methods

- `render()` — create a button
- `surround()` — works with selected range
- `checkState()` — get Tool's activated state by selected range

Also, you can provide optional methods

- `renderActions()` — create additional element below the buttons
- `clear()` — clear Tool's stuff on opening/closing of Inline Toolbar
- `shortcut()` — shortcut that handles Tool

### render()

Method that returns button to append at the Inline Toolbar

#### Parameters

Method does not accept any parameters

#### Return value

type | description | 
-- | -- |
`HTMLElement` | element that will be added to the Inline Toolbar |


### surround(range: Range)

Method that accepts selected range and wrap it somehow

#### Parameters

name | type | description | 
-- |-- | -- |
range | Range | first range of current Selection |

#### Return value

There is no return value

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

### clear()

Optional method that will be called on opening/closing of Inline Toolbar. 
Can contain logic for clearing Tool's stuff, such as inputs, states and other.

#### Parameters

Method does not accept any parameters

#### Return value

Method should not return a value. 
