# CodeX Editor API

Each Block instance provided API by default. Plugin and Tune Developers 
can use Editor API as they want.

Example:

1) Developing Tunes: 

Create Class that implements block-tune.ts

Your Tune's constructor gets two arguments: 
 - {Object} api - object contains public methods from modules 
 - {Object} settings - settings contains block default state. 
 This object could have information about cover, anchor and so on.

---
 
### Api object description
