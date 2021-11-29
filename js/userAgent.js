var userAgent = navigator.userAgent;
exports.userAgent = userAgent;

exports.getUserAgent = function(){
    exports.isMobile = /(iPad|iPhone|Android)/i.test( navigator.userAgent );
    return exports.isMobile;
}
