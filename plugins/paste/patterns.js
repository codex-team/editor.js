/**
 * Patterns
 *
 * To add plugin create callback function in one and add here this object:
 * {
 *      type     : '', - type of pasted text (for example, 'image', 'url' or your plugin name)
 *      regex    : /regex/, - regex for pasted text
 *      callback : yourPlugin.smthPastedCallback - callback function in your plugin which is called when pasted text matches regex
 * }
 *
 */

var paste = paste || {};

paste.patterns = [
    {
        type: 'image',
        regex: /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
        callback: image.uploadImageFromUri
    },
    {
        type: 'uploadCare',
        regex: /^https:\/\/(uploadcare\.cmtt\.ru|ucarecdn\.com|static[0-9]+\.siliconrus\.cmtt\.ru|static[0-9]+\.cmtt\.ru)/i,
        callback: image.uploadImageFromUri
    },
    {
        type: 'instagram',
        regex: /http?.+instagram.com\/p\/([a-zA-Z0-9]*)/,
        callback: instagram.urlPastedCallback
    },
    {
        type: 'twitter',
        regex: /http?.+twitter.com?.+\//,
        callback: twitter.urlPastedCallback
    },
    // {
    //     type: 'facebook',
    //     regex: /https?.+facebook.+\/\d+\?/,
    //     callback: ''//pasteTool.callbacks.facebookMedia
    // },
    {
        type: 'vk',
        regex: /https?:\/\/vk\.com\/.*(?:video)([-0-9]+_[0-9]+)/, ///https?.+vk?.com\/feed\?w=wall\d+_\d+/,
        callback: embed.urlPastedCallback

        // https://vk.com/video142051356_456244081
    },
    {
        type: 'youtube',
        regex: /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'vimeo',
        regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'coub',
        regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'vine',
        regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'imgur',
        regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'gfycat',
        regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'twitch-channel',
        regex: /https?:\/\/www.twitch.tv\/([^\/\?\&]*)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'twitch-video',
        regex: /https?:\/\/www.twitch.tv\/[^\/\?\&]*\/v\/([0-9]*)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'yandex-music-album',
        regex: /https?:\/\/music.yandex.ru\/album\/([0-9]*)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'yandex-music-track',
        regex: /https?:\/\/music.yandex.ru\/album\/([0-9]*)\/track\/([0-9]*)/,
        callback: embed.urlPastedCallback
    },
    {
        type: 'yandex-music-playlist',
        regex: /https?:\/\/music.yandex.ru\/users\/([^\/\?\&]*)\/playlists\/([0-9]*)/,
        callback: embed.urlPastedCallback
    }
];
