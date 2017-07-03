module.exports = {
    serverPort: 8080,
    dbConnection: 'mongodb://localhost:27017/koaServer',
    prefixUrl: '/api/',
    defaultPassword: 'admin',
    jwtTokenSecret: 'koa-server',
    thumbPath: 'upload/thumb'
};