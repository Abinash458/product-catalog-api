const http = require('http');
const app = require('./app');
var port = 3002;

const server = http.createServer(app);

server.listen(port);