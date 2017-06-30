// routes
const router = require('koa-router')();
const article = require('./routes/article');
const category = require('./routes/category');
const tag = require('./routes/tag');
const upload = require('./routes/upload');
const authIsVerified = require('./utils/auth');

module.exports = routes = (app) => {
    // router.use('*', async (ctx, next) => {
    //     // Set Header
    //     const origin = ctx.req.headers.origin || ctx.req.headers.host || '';
    //     const allowedOrigins = ['https://test', 'https://test'];
    //     if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    //         ctx.header['Access-Control-Allow-Origin'] = origin;
    //     };
    //     ctx.header['Access-Control-Allow-Headers'] = 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With';
    //     ctx.header['Access-Control-Allow-Methods'] = 'PUT,PATCH,POST,GET,DELETE,OPTIONS';
    //     ctx.header['Access-Control-Max-Age'] = '1728000';
    //     ctx.header['Content-Type'] = 'application/json;charset=utf-8';
    //     ctx.header['X-Powered-By'] = 'Nodepress 1.0.0';

    //     // OPTIONS
    //     if (ctx.req.method == 'OPTIONS') {
    //         ctx.status = 200;
    //         return false;
    //     };

    //     // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
    //     if (Object.is(process.env.NODE_ENV, 'production')) {
    //         const { origin, referer } = ctx.req.headers;
    //         const originVerified = (!origin || origin.includes('surmon.me')) &&
    //             (!referer || referer.includes('surmon.me'))
    //         if (!originVerified) {
    //             ctx.status = 403;
    //             ctx.body = { code: 0, message: '来者何人！' }
    //             // res.status(403).jsonp({ code: 0, message: '来者何人！' })
    //             return false;
    //         };
    //     };

    //     // 排除auth的post请求 && 评论的post请求 && like请求
    //     // const isLike = Object.is(ctx.req.url, '/like') && Object.is(ctx.req.method, 'POST');
    //     // const isPostAuth = Object.is(ctx.req.url, '/auth') && Object.is(ctx.req.method, 'POST');
    //     // const isPostComment = Object.is(ctx.req.url, '/comment') && Object.is(ctx.req.method, 'POST');
    //     // if (isLike || isPostAuth || isPostComment) {
    //     //     return next();
    //     // };

    //     // 拦截所有非管路员的非get请求
    //     if (!authIsVerified(ctx.req) && !Object.is(ctx.req.method, 'GET')) {
    //         // res.status(401).jsonp({ code: 0, message: '来者何人！' })
    //         ctx.status = 401;
    //         ctx.body = { code: 0, message: '来者何人！' }
    //         return false;
    //     };

    //     return next();
    // });

    router.use('/api/articles', article.routes(), article.allowedMethods());
    router.use('/api/categories', category.routes(), category.allowedMethods());
    router.use('/api/tags', tag.routes(), tag.allowedMethods());
    router.use('/api/upload', upload.routes(), upload.allowedMethods());

    app.use(router.routes()).use(router.allowedMethods());
};

module.exports = routes;


