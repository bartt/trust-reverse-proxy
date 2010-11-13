require.paths.unshift(__dirname + '/../lib');
var connect = require('connect')
  , acceptReverseProxy = require('trustReverseProxy');

app = connect.createServer(acceptReverseProxy({proxyID: 'x-my-secret-proxy'}));

// Check for connect middleware errors. No output is GOOD.
app.use('/', connect.lint(app));


