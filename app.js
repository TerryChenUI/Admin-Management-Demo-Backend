const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')

const mongodb = require('./mongodb');
const setting = require('./config/setting.js');

// routes 
const tag = require('./routes/tag');

// connect mongodb
mongodb.connect();

const app = new Koa();
app.use(bodyParser());
 
router.use('/api/tags', tag.routes(), tag.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// app.use(async (ctx) => {
//   let url = ctx.url;
//   // 从上下文的request对象中获取
//   let request = ctx.request;
//   let req_query = request.query;
//   let req_querystring = request.querystring;

//   // 从上下文中直接获取
//   let ctx_query = ctx.query;
//   let ctx_querystring = ctx.querystring;

//   ctx.body = {
//     url,
//     req_query,
//     req_querystring,
//     ctx_query,
//     ctx_querystring
//   }
//   ctx.status = 404
// })

app.listen(setting.serverPort, () => console.log(`server is running on localhost:${setting.serverPort}`));