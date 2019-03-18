/**
 * Module to compose output JSON preview
 */
const cPreview = (function (module) {
  /**
   * Shows JSON in pretty preview
   * @param {object} output - what to show
   * @param {Element} holder - where to show
   */
  module.show = function(output, holder) {
    /** Make JSON pretty */
    output = JSON.stringify( output, null, 4 );
    /** Encode HTML entities */
    output = encodeHTMLEntities( output );
    /** Stylize! */
    output = stylize( output );
    holder.innerHTML = output;
  };

  /**
   * Converts '>', '<', '&' symbols to entities
   */
  function encodeHTMLEntities(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * Some styling magic
   */
  function stylize(string) {
    /** Stylize JSON keys */
    string = string.replace( /"(\w+)"\s?:/g, '"<span class=sc_key>$1</span>" :');
    /** Stylize tool names */
    string = string.replace( /"(paragraph|quote|list|header|link|code|image|delimiter|raw|checklist|table|embed|warning)"/g, '"<span class=sc_toolname>$1</span>"');
    /** Stylize HTML tags */
    string = string.replace( /(&lt;[\/a-z]+(&gt;)?)/gi, '<span class=sc_tag>$1</span>' );
    /** Stylize strings */
    string = string.replace( /"([^"]+)"/gi, '"<span class=sc_attr>$1</span>"' );
    /** Boolean/Null */
    string = string.replace( /\b(true|false|null)\b/gi, '<span class=sc_bool>$1</span>' );
    return string;
  }

  return module;
})({});
