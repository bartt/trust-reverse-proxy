# trustReverseProxy

trustReverseProxy is connect middleware to determine which connections are made through a trusted reverse proxy. Reverse proxies can be used to offload handling SSL connections to and/or for serving up static content.

When SSL connections are handled by a reverse proxy, all connections to connect are over HTTP. This middleware allows you forward SSL connections (almost) transparantly to connect. Typically the reverse proxy adds several custom HTTP headers to the proxied request. These headers can be used to distinguish secure connections (HTTPS) from insecure connections (HTTP).

# Examples

## Minimal configuration

    var connect = require('connect'),
      acceptReverseProxy = require('acceptReverseProxy');

    app = connect.createServer(acceptReverseProxy({proxyID: 'x-my-secret-proxy'}));

## Trusting a reverse proxy on a different IP address

    var connect = require('connect'),
      acceptReverseProxy = require('acceptReverseProxy');

    app = connect.createServer(acceptReverseProxy({
      proxyID: 'x-my-secret-proxy',
      proxyIp: '192.168.0.1'
    }));


## Trusting more than 1 reverse proxy

    var connect = require('connect'),
      acceptReverseProxy = require('acceptReverseProxy');

    app = connect.createServer(acceptReverseProxy({
      proxyID: 'x-my-secret-proxy',
      proxyIp: ['192.168.0.1', '192.168.0.2'],
      trust: function(req) {
        return req.headers[options.proxyID] && (proxyIp.indexOf(req.client.remoteAddress) !== -1);
      }
    }));

## Retrieve browser's remote address differently

By default trustReverseProxy uses the IP address from the X-Real-IP or X-Forwarded-For headers. Two commonly used headers by reverse proxies to indicate the browser's remote address.

This example uses the header x-my-real-forwarded-ip instead.

    var connect = require('connect'),
      acceptReverseProxy = require('acceptReverseProxy');

    app = connect.createServer(acceptReverseProxy({
      proxyID: 'x-my-secret-proxy',
      remoteAddress: function(req) {
        return req.headers['x-my-real-forwarded-ip'];
      }
    }));

## Detect secure connections

By default trustReverseProxy detects secure by looking at the x-forwarded-scheme header. A connection is considered secure when this header has the value 'https'.

In this example a connection is considered secure when the header x-forwarded-ssl the value true.

    var connect = require('connect'),
      acceptReverseProxy = require('acceptReverseProxy');

    app = connect.createServer(acceptReverseProxy({
      proxyID: 'x-my-secret-proxy',
      isSecure: function(req) {
        return req.headers['x-forwarded-ssl'] === true;
      }
    }));
