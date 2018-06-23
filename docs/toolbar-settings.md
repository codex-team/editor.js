# CodeX Editor Toolbar Settings Module

Toolbar Module has space for Block settings. Settings divided into:
 - space for plugin's settings, that is described by «Plugin»'s Developer
 - space for default settings. This option is also can be implemented end expanded

They difference between zones is that the first option is specified by plugin
and each Block may have different options, when second option is for every Block
regardless to the plugin's option.

### Let's look the examples:

«Plugin»'s Developers need to expand «makeSettings» method that returns HTML. 
Every user action will be handled by itself. So, you can easily write
callbacks that switches your content or makes better. For more information
read [Tools](tools.md).

«Tune»'s Developers need to implement core-provided interface to develop
tunes that will be appeared in Toolbar-settings zone.

Tunes must expand two important methods:
 - `render()` - returns HTML and it is appended to the default settings zone
 - `save()` - extracts important information to be saved
 
No restrictions. Handle user action by yourself  
