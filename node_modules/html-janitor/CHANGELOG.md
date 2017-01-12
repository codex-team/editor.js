# HTML Janitor

Sanitises HTML to a whitelist that you can control

## 2.0.2

Validation functions can now return validation objects rather than simply outcomes.

Thanks to [Brad Vogel](https://github.com/bradvogel) for this functionality.

## 2.0.1

Adds the ability to configure HTML Janitor with validation functions that determine whether a given element should be allowed programatically.

Thanks [Brad Vogel](https://github.com/bradvogel) for adding this functionality.

## 2.0.0

Makes element configuration (e.g. p: true/false) symmetrical. Previously setting and element to false remove the element completely from the cleaned output.

## 1.1.0

It should be possible to allow all attributes on an element. This was mentioned in the documentation but was not working as intended.

As the previous behaviour was broken I don't believe anyone was using it but if you were then hopefully it will just magically work for you now.

Thanks [Alex Palaistras](https://github.com/deuill) for fixing this.

## 1.0.1

PRE has been added to the list of block elements

## 1.0.0

Changes the definition of what constitutes a block tag and also the code will now strip out incorrectly nested block and inline tags.

Thanks to [Ankit Ahuja](https://github.com/ankit) for this contribution.

## 0.3.2

Adds IE NodeWalker compatibility change from [daniel-nelson](https://github.com/daniel-nelson), thanks.

*Note*: there are no CI tests for IE so support is not guaranteed

## 0.3.1

No functionality changes but corrects the package json for the NPM release