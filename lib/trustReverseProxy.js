module.exports = function reverseProxySetup(options){
  options = options || {};

  // IP address of the trusted reverse proxy.
  var proxyIp = options.proxyIp || '127.0.0.1';

  // Function to test whether or not the request is coming through the trusted reverse proxy.
  var trust = typeof options.trust ==='function'
    ? options.trust
    : function trustReverseProxy(req){
    return req.headers[options.proxyID] && (req.client.remoteAddress === proxyIp);
  };

  // Function to test whether or not the request proxied by the reverse proxy is secure or not.
  // Nginx can add the x-forwarded-scheme header with the scheme (http / https) of the incoming request.
  var isSecure = typeof options.isSecure === 'function'
    ? options.isSecure
    : function isSecure(req){
    return req.headers['x-forwarded-scheme'] === 'https';
  };

  // Function to fetch the remote address from the browser that connected to the reverse proxy.
  var remoteAddress = typeof options.remoteAddress === 'function'
    ? options.remote
    : function remoteAddress(req){
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
  };

  // Check if the request is proxied by a trusted reverse proxy. If so determine if the connection to the reverse
  // proxy was secure (i.e. SSL) or not. And set the client's remote address to the remote address of the browser
  // connected to the reverse proxy.
  return function(req, res, next){
    if (!options.proxyID) {
      next(new Error('trustReverseProxy requires a options object with at least the proxyID attribute. ' +
              'proxyID is name of the header in lower case, identifying the reverse proxy. ' +
              'E.g. x-my-secret-proxy'));
      return;
    };
    if (trust(req)) {
      // Can't set the connection's secure attribute as that changes how the connection is closed. Since there is no
      // SSL connection between reverse proxy and node, we'll have to set a custom property.
      req.connection.proxySecure = isSecure(req);
      req.client.remote = remoteAddress(req);
    }
    next();
  };
};
