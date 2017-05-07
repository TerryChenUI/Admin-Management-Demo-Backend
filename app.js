const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')

const mongodb = require('./mongodb');
const config = require('./config');

// routes
const article = require('./routes/article');
const category = require('./routes/category');
const tag = require('./routes/tag');


// connect mongodb
mongodb.connect();

const app = new Koa();
app.use(bodyParser());
 
router.use('/api/articles', article.routes(), article.allowedMethods());
router.use('/api/categories', category.routes(), category.allowedMethods());
router.use('/api/tags', tag.routes(), tag.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.serverPort, () => console.log(`server is running on localhost:${config.serverPort}`));