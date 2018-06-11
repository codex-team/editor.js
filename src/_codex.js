// eslint-disable-next-line
let modules = editorModules.map( module => require('./components/modules/' + module ));


module.exports = class CodexEditor_ {

    /**
   * @param {EditorConfig} config - user configuration
   *
   */
    constructor(config) {

        console.log('class inited', modules);

    }

};