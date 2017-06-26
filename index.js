const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const mongodb = require('./mongodb');
const config = require('./config');
const routes = require('./routes');

// connect mongodb
mongodb.connect();

const app = new Koa();
app.use(bodyParser());

// route config
routes(app);

app.listen(config.serverPort, () => console.log(`server is running on localhost:${config.serverPort}`));