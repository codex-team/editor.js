var storage = function () {

    var editor  = codex.editor,
        interval   = null,
        config_ = {
            saveInterval: 100
        };

    if (!window.localStorage) {

        window.console.warn('LocalStorage is not supported in your browser');
        return;

    }

    var prepare = function (config) {

        config_ = config || config_;

        if (get())
            editor.state.blocks.items = get();

        init(config_.saveInterval);

        return Promise.resolve();

    };

    var init = function (saveInterval) {

        interval = window.setInterval(save, saveInterval);

    };

    var save = function () {

        editor.saver.saveBlocks();

        window.setTimeout(function () {

            var savedData = editor.state.jsonOutput;
            window.localStorage['codex.editor.savedData'] = JSON.stringify(savedData);

        }, 1000);

    };

    var get = function () {

        if (!window.localStorage['codex.editor.savedData'])
            return;

        var data = window.localStorage['codex.editor.savedData'],
            items = JSON.parse(data);

        return items;

    };

    var stop = function () {

        window.clearInterval(interval);

    };

    return {
        prepare: prepare,
        init   : init,
        save   : save,
        get    : get,
        stop   : stop,
        config : config_
    };

}();