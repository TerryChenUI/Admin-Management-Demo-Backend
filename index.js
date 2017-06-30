const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const serve = require('koa-static');
const path = require('path');

const mongodb = require('./mongodb');
const config = require('./config');
const routes = require('./routes');

// connect mongodb
mongodb.connect();

const app = new Koa();
app.use(bodyParser());
app.use(serve(path.join(__dirname, '/public')));
app.use(cors());

// route config
routes(app);

app.listen(config.serverPort, () => console.log(`server is running on localhost:${config.serverPort}`));