function base64URLEncode(str) {
    return btoa(unescape(encodeURIComponent(str)))
    return new Buffer(str).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

module.exports = base64URLEncode