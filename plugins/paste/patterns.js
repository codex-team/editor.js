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

pasteTool.patterns = [
    {
        type: 'image',
        regex: /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
        callback: ceImage.urlPastedCallbacks.uploadImage
    },
    {
        type: 'instagram',
        regex: new RegExp("http?.+instagram.com\/p?."),
        callback: instagramTool.urlPastedCallback
    },
    {
        type: 'twitter',
        regex: new RegExp("http?.+twitter.com?.+\/"),
        callback: twitterTool.urlPastedCallback
    },
    {
        type: 'facebook',
        regex: /https?.+facebook.+\/\d+\?/,
        callback: ''//pasteTool.callbacks.facebookMedia
    },
    {
        type: 'vk',
        regex: /https?.+vk?.com\/feed\?w=wall\d+_\d+/,
        callback: ''//pasteTool.callbacks.vkMedia
    },
    {
        type: 'youtube',
        regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:[\?\&]t\=(\d*)|)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'vimeo',
        regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'coub',
        regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'vine',
        regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'vk',
        regex: /https?:\/\/vk\.com\/.*(?:video)([-_0-9]+)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'imgur',
        regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    },
    {
        type: 'gfycat',
        regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
        callback: videoTool.urlPastedCallbacks.generalCallback
    }

];