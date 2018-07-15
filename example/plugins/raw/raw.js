/**
* Plugin for CodeX.Editor
* Implements RAW-data block
*/
var rawPlugin = function (plugin) {
  var editor = codex.editor;

  plugin.render = function (data) {
    var input   = editor.draw.node('TEXTAREA', 'raw-plugin__input', {});

    input.placeholder = 'Вставьте HTML код';

    if (data && data.raw) {
      input.value = data.raw;
    }

    return input;
  };

  plugin.save = function (block) {
    return {
      raw: block.value
    };
  };

  plugin.validate = function (data) {
    if (data.raw.trim() === '') {
      return;
    }

    return true;
  };

  plugin.destroy = function () {
    rawPlugin = null;
  };

  return plugin;
}({});