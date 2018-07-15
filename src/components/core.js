/**
 * Codex Editor Core
 *
 * @author Codex Team
 * @version 2.0.0
 */
export default class Core {
  /**
     * Module key name
     * @returns {string}
     */
  static get name() {
    return 'core';
  };

  /** Editor script prefixes */
  static get scriptPrefix() {
    return 'cdx-script-';
  }

  /**
     *
     * @param Editor
     * @param Editor.modules {@link Tools#list}
     * @param Editor.config {@link CodexEditor#configuration}
     */
  constructor(config) {
    // this.Editor.modules.toolbar;

    this.Editor = null;

    // console.log(this.Editor);


    // this.toolbar = modules.toolbar;

    // this.sanitizer = null;
    // this.state = {};
  }

  /**
     * @param Editor
     * @param Editor.modules {@link CodexEditor#moduleInstances}
     * @param Editor.config {@link CodexEditor#configuration}
     * @param Editor
     */
  set state(Editor) {
    this.Editor = Editor;
  }

  /**
     * @public
     *
     * Editor preparing method
     * @return Promise
     */
  prepare() {
    // let self = this;

    console.log('Core prepare fired');

    /**
         * Обращение к другому модулю
         */
    console.log(this.Editor.ui.wrapper);


    return;

    /**

        return new Promise(function (resolve, reject) {

            if (typeof self.Editor.config.holderId === undefined ) {

                reject(Error("Holder wasn't found by ID: #" + userSettings.holderId));

            } else {

                resolve();

            }

            resolve();

        });

         */
  }


  /**
     * Native Ajax
     * @param {String}   settings.url         - request URL
     * @param {function} settings.beforeSend  - returned value will be passed as context to the Success, Error and Progress callbacks
     * @param {function} settings.success
     * @param {function} settings.progress
     */
  ajax(settings) {
    if (!settings || !settings.url) {
      return;
    }

    var XMLHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
      encodedString,
      isFormData,
      prop;


    settings.async           = true;
    settings.type            = settings.type || 'GET';
    settings.data            = settings.data || '';
    settings['content-type'] = settings['content-type'] || 'application/json; charset=utf-8';

    if (settings.type == 'GET' && settings.data) {
      settings.url = /\?/.test(settings.url) ? settings.url + '&' + settings.data : settings.url + '?' + settings.data;
    } else {
      encodedString = '';
      for(prop in settings.data) {
        encodedString += (prop + '=' + encodeURIComponent(settings.data[prop]) + '&');
      }
    }

    if (settings.withCredentials) {
      XMLHTTP.withCredentials = true;
    }

    /**
         * Value returned in beforeSend funtion will be passed as context to the other response callbacks
         * If beforeSend returns false, AJAX will be blocked
         */
    let responseContext,
      beforeSendResult;

    if (typeof settings.beforeSend === 'function') {
      beforeSendResult = settings.beforeSend.call();

      if (beforeSendResult === false) {
        return;
      }
    }

    XMLHTTP.open( settings.type, settings.url, settings.async );

    /**
         * If we send FormData, we need no content-type header
         */
    isFormData = isFormData_(settings.data);

    if (!isFormData) {
      if (settings.type !== 'POST') {
        XMLHTTP.setRequestHeader('Content-type', settings['content-type']);
      } else {
        XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
    }

    XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    responseContext = beforeSendResult || XMLHTTP;

    if (typeof settings.progress === 'function') {
      XMLHTTP.upload.onprogress = settings.progress.bind(responseContext);
    }

    XMLHTTP.onreadystatechange = function () {
      if (XMLHTTP.readyState === 4) {
        if (XMLHTTP.status === 200) {
          if (typeof settings.success === 'function') {
            settings.success.call(responseContext, XMLHTTP.responseText);
          }
        } else {
          if (typeof settings.error === 'function') {
            settings.error.call(responseContext, XMLHTTP.responseText, XMLHTTP.status);
          }
        }
      }
    };

    if (isFormData) {
      // Sending FormData
      XMLHTTP.send(settings.data);
    } else {
      // POST requests
      XMLHTTP.send(encodedString);
    }

    return XMLHTTP;
  }
};
// module.exports = (function (core) {
//
//     let editor = codex.editor;
//
//
//     /**
//      * @protected
//      *
//      * Helper for insert one element after another
//      */
//     core.insertAfter = function (target, element) {
//
//         target.parentNode.insertBefore(element, target.nextSibling);
//
//     };
//
//     /**
//      * @const
//      *
//      * Readable DOM-node types map
//      */
//     core.nodeTypes = {
//         TAG     : 1,
//         TEXT    : 3,
//         COMMENT : 8,
//         DOCUMENT_FRAGMENT: 11
//     };
//
//     /**
//      * @const
//      * Readable keys map
//      */
//     core.keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 };
//
//     /**
//      * @protected
//      *
//      * Check object for DOM node
//      */
//     core.isDomNode = function (el) {
//
//         return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
//
//     };
//
//     /**
//     * Checks passed object for emptiness
//     * @require ES5 - Object.keys
//     * @param {object}
//     */
//     core.isEmpty = function ( obj ) {
//
//         return Object.keys(obj).length === 0;
//
//     };
//
//     /**
//     * Appends script to head of document
//     * @return Promise
//     */
//     core.importScript = function (scriptPath, instanceName) {
//
//         return new Promise(function (resolve, reject) {
//
//             let script;
//
//             /** Script is already loaded */
//             if ( !instanceName ) {
//
//                 reject('Instance name is missed');
//
//             } else if ( document.getElementById(editor.scriptPrefix + instanceName) ) {
//
//                 resolve(scriptPath);
//
//             }
//
//             script = document.createElement('SCRIPT');
//             script.async = true;
//             script.defer = true;
//             script.id = editor.scriptPrefix + instanceName;
//
//             script.onload = function () {
//
//                 resolve(scriptPath);
//
//             };
//
//             script.onerror = function () {
//
//                 reject(scriptPath);
//
//             };
//
//             script.src = scriptPath;
//             document.head.appendChild(script);
//
//         });
//
//     };
//
//     /**
//      * Function for checking is it FormData object to send.
//      * @param {Object} object to check
//      * @return boolean
//      */
//     var isFormData_ = function (object) {
//
//         return object instanceof FormData;
//
//     };
//
//     /**
//      * Check block
//      * @param target
//      * @description Checks target is it native input
//      */
//     core.isNativeInput = function (target) {
//
//         var nativeInputAreas = ['INPUT', 'TEXTAREA'];
//
//         return nativeInputAreas.indexOf(target.tagName) != -1;
//
//     };
//
//     /**
//      * Check if block is empty
//      * We should check block textContent, child native inputs and some exceptions like IMG and IFRAME
//      *
//      * @param block
//      * @returns {boolean}
//      */
//     core.isBlockEmpty = function (block) {
//
//         const EXCEPTION_TAGS = ['IMG', 'IFRAME'];
//
//         var nativeInputs         = block.querySelectorAll('textarea, input'),
//             nativeInputsAreEmpty = true,
//             textContentIsEmpty   = !block.textContent.trim();
//
//         Array.prototype.forEach.call(nativeInputs, function (input) {
//
//             if (input.type == 'textarea' || input.type == 'text') {
//
//                 nativeInputsAreEmpty = nativeInputsAreEmpty && !input.value.trim();
//
//             }
//
//         });
//
//         return textContentIsEmpty && nativeInputsAreEmpty && !EXCEPTION_TAGS.includes(block.tagName);
//
//     };
//
//
//     return core;
//
// })({});
