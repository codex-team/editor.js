/**
 * Embed plugin by gohabereg
 * @version 1.0.0
 */
var embed = function (embed_plugin) {
  var methods = {

    addInternal: function (content) {
      codex.editor.content.switchBlock(codex.editor.content.currentNode, content);

      var blockContent = codex.editor.content.currentNode.childNodes[0];

      blockContent.classList.add('embed__loader');

      setTimeout(function () {
        blockContent.classList.remove('embed__loader');
      }, 1000);
    },

    getHtmlWithEmbedId: function (type, id) {
      return services[type].html.replace(/<\%\= remote\_id \%\>/g, id);
    },

    makeElementFromHtml: function (html) {
      var wrapper = document.createElement('DIV');

      wrapper.innerHTML = html;

      return wrapper;
    },

    getRemoteId: function (source, execArray) {
      switch(source) {
        case 'yandex-music-track':
          id = execArray[2]+'/'+execArray[1];
          break;
        case 'yandex-music-playlist':
          id = execArray[1]+'/'+execArray[2];
          break;
        default:
          id = execArray[1];
      }

      return id;
    }
  };

  var services = {
    youtube: {
      regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:[\?\&]t\=(\d*)|)/,
      html: '<iframe src="https://www.youtube.com/embed/<%= remote_id %>" style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
      height: 320,
      width: 580
    }
  };


  embed_plugin.make = function (data, isInternal) {
    if (!data.remote_id)
      return;

    var html  = methods.getHtmlWithEmbedId(data.source, data.remote_id),
      block = methods.makeElementFromHtml(html);

    block.dataset.remoteId = data.remote_id;
    block.dataset.source = data.source;
    block.dataset.thumbnailUrl = data.thumbnailUrl;

    block.classList.add('embed');

    // var sidePadding = (600 - services[data.source].width) / 2 + 'px';

    // block.style.padding = '30px ' + sidePadding;

    if (isInternal) {
      methods.addInternal(block);
    }

    return block;
  };

  /**
     * Saving JSON output.
     * Upload data via ajax
     */
  embed_plugin.save = function (blockContent) {
    if (!blockContent)
      return;

    var data,
      source = blockContent.dataset.source;

    data = {
      source: source,
      remote_id: blockContent.dataset.remoteId,
      thumbnailUrl: blockContent.dataset.thumbnailUrl,
      height: services[source].height,
      width: services[source].width
    };

    return data;
  };

  /**
     * Render data
     */
  embed_plugin.render = function (data) {
    return embed_plugin.make(data);
  };

  embed_plugin.urlPastedCallback = function (url, pattern) {
    var execArray = pattern.regex.exec(url),
      id = methods.getRemoteId(pattern.type, execArray);

    var data = {
      source: pattern.type,
      remote_id: id,
      thumbnailUrl: url
    };

    embed_plugin.make(data, true);
  };

  embed_plugin.validate = function (savedData) {
    var source = savedData.source,
      execArray = services[source].regex.exec(savedData.thumbnailUrl),
      remoteId = methods.getRemoteId(source, execArray);

    return remoteId == savedData.remote_id;
  };

  embed_plugin.pastePatterns = [
    {
      type: 'vk',
      regex: /https?:\/\/vk\.com\/.*(?:video)([-0-9]+_[0-9]+)/, // /https?.+vk?.com\/feed\?w=wall\d+_\d+/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'youtube',
      regex: /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'vimeo',
      regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'coub',
      regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'vine',
      regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'imgur',
      regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'gfycat',
      regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'twitch-channel',
      regex: /https?:\/\/www.twitch.tv\/([^\/\?\&]*)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'twitch-video',
      regex: /https?:\/\/www.twitch.tv\/(?:[^\/\?\&]*\/v|videos)\/([0-9]*)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'yandex-music-album',
      regex: /https?:\/\/music.yandex.ru\/album\/([0-9]*)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'yandex-music-track',
      regex: /https?:\/\/music.yandex.ru\/album\/([0-9]*)\/track\/([0-9]*)/,
      callback: embed_plugin.urlPastedCallback
    },
    {
      type: 'yandex-music-playlist',
      regex: /https?:\/\/music.yandex.ru\/users\/([^\/\?\&]*)\/playlists\/([0-9]*)/,
      callback: embed_plugin.urlPastedCallback
    } ];

  embed_plugin.destroy = function () {
    embed = null;
  };

  return embed_plugin;
}({});