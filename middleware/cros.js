module.exports = () => {
    return function (ctx, next) {
        return new Promise((resolve, reject) => {
            // Set Header
            const origin = ctx.req.headers.origin || ctx.req.headers.host || '';
            const allowedOrigins = ['https://test', 'https://test'];
            if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
                ctx.header['Access-Control-Allow-Origin'] = origin;
            };
            ctx.header['Access-Control-Allow-Headers'] = 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With';
            ctx.header['Access-Control-Allow-Methods'] = 'PUT,PATCH,POST,GET,DELETE,OPTIONS';
            ctx.header['Access-Control-Max-Age'] = '1728000';
            ctx.header['Content-Type'] = 'application/json;charset=utf-8';
            ctx.header['X-Powered-By'] = 'Nodepress 1.0.0';
            resolve();
            return next();
        }).catch((err) => {
            return next();
        })
    }
}