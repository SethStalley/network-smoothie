var HttpProxy, Logger, SocksProxy, crypto, inspect, logger, os, pkg, program,
  splice = [].splice

os = require('os')

inspect = require('util')

crypto = require('crypto')

program = require('commander')

SocksProxy = require('../../lib/dispatch-proxy/lib/proxy/socks')

// logger = new Logger({
//   tab: 10,
//   gutter: ' '
// }).registerTag('b', ['bold']).registerTag('s', ['green']).registerTag('i', ['cyan']).registerTag('e', ['red']).registerTag('a', [ // Success // Info // Error
//   'b',
//   'underline' // Address
// ]).registerEvent('request', '<b><i>request').registerEvent('dispatch', '<b><i>dispatch').registerEvent('connect', '<b><s>connect').registerEvent('response', '<b><s>response').registerEvent('error', '<b><e>error').registerEvent('end', '<b><i>end').registerMode('default', ['error']).registerMode('debug', true);

// program.version(pkg.version);

// program.command('list').description('list all available network interfaces').action(function() {
//   var address, addrs, family, i, interfaces, internal, len, name, opts, results;
//   interfaces = os.networkInterfaces();
//   results = [];
//   for (name in interfaces) {
//     addrs = interfaces[name];
//     logger.log(`<b>${name}`);
//     for (i = 0, len = addrs.length; i < len; i++) {
//       ({address, family, internal} = addrs[i]);
//       opts = [];
//       if (family) {
//         opts.push(family);
//       }
//       if (internal) {
//         opts.push('internal');
//       }
//       logger.log(`    <a>${address}</>` + (opts.length > 0 ? ` (${opts.join(', ')})` : ''));
//     }
//     results.push(logger.log(''));
//   }
//   return results;
// });

// program.command('start').usage('[options] [addresses]').description('start a proxy server').option('-H, --host <h>', 'which host to accept connections from (defaults to localhost)', String).option('-p, --port <p>', 'which port to listen to for connections (defaults to 8080 for HTTP proxy, 1080 for SOCKS proxy)', Number).option('--http', 'start an http proxy server', Boolean).option('--debug', 'log debug info in the console', Boolean).action(function(...args) {
//   var addr, address, addresses, addrs, arg, debug, host, http, https, i, j, len, len1, name, port, priority, proxy, ref, ref1, type;
//   ref = args, [...args] = ref, [{port, host, http, https, debug}] = splice.call(args, -1);
//   if (debug) {
//     logger.setMode('debug');
//   }
//   addresses = [];
//   if (args.length === 0) {
//     ref1 = os.networkInterfaces();
//     for (name in ref1) {
//       addrs = ref1[name];
//       for (i = 0, len = addrs.length; i < len; i++) {
//         addr = addrs[i];
//         if (addr.family === 'IPv4' && !addr.internal) {
//           addresses.push({
//             address: addr.address,
//             priority: 1
//           });
//         }
//       }
//     }
//   } else {
//     for (j = 0, len1 = args.length; j < len1; j++) {
//       arg = args[j];
//       [address, priority] = arg.split('@');
//       priority = priority ? parseInt(priority) : 1;
//       addresses.push({address, priority});
//     }
//   }
//   host || (host = 'localhost');
//   if (http) {
//     port || (port = 8080);
//     type = 'HTTP';
//     proxy = new HttpProxy(addresses, port, host);
//     proxy.on('request', function({clientRequest, serverRequest, localAddress}) {
//       var id;
//       id = (crypto.randomBytes(3)).toString('hex');
//       logger.emit('request', `[${id}] <a>${clientRequest.url}</>`);
//       logger.emit('dispatch', `[${id}] <a>${localAddress}</>`);
//       serverRequest.on('response', function(serverResponse) {
//         return logger.emit('response', `[${id}] <magenta><b>${serverResponse.statusCode}</></>`);
//       }).on('error', function(err) {
//         return logger.emit('error', `[${id}] clientRequest\n${escape(err.stack)}`);
//       }).on('end', function() {
//         return logger.emit('end', `[${id}] serverRequest`);
//       });
//       return clientRequest.on('error', function(err) {
//         return logger.emit('error', `[${id}] clientRequest\n${escape(err.stack)}`);
//       }).on('end', function() {
//         return logger.emit('end', `[${id}] clientRequest`);
//       });
//     }).on('error', function(err) {
//       return logger.emit('error', `server\n${escape(err.stack)}`);
//     });
//   } else {
//     port || (port = 1080);
//     type = 'SOCKS';
//     proxy = new SocksProxy(addresses, port, host);
//     proxy.on('request', function({serverConnection, clientConnection, host, port, localAddress}) {
//       var id;
//       id = (crypto.randomBytes(3)).toString('hex');
//       logger.emit('request', `[${id}] <a>${host}</><b>:${port}</>`);
//       logger.emit('dispatch', `[${id}] <a>${localAddress}</>`);
//       serverConnection.on('connect', function() {
//         return logger.emit('connect', `[${id}] <a>${host}</><b>:${port}</>`);
//       }).on('error', function(err) {
//         return logger.emit('error', `[${id}] serverConnection\n${escape(err.stack)}`);
//       }).on('end', function() {
//         return logger.emit('end', `[${id}] serverConnection`);
//       });
//       return clientConnection.on('error', function(err) {
//         return logger.emit('error', `[${id}] clientConnection\n${escape(err.stack)}`);
//       }).on('end', function() {
//         return logger.emit('end', `[${id}] clientConnection`);
//       });
//     }).on('error', function(err) {
//       return logger.emit('error', `server\n${escape(err.stack)}`);
//     }).on('socksError', function(err) {
//       return logger.emit('error', `socks\n${escape(err.message)}`);
//     });
//   }
//   return logger.log(`<b><magenta>${type}</></> server started on <a>${host}</><b>:${port}</>\nDispatching to addresses ${((function() {
//     var k, len2, results;
//     results = [];
//     for (k = 0, len2 = addresses.length; k < len2; k++) {
//       ({address, priority} = addresses[k]);
//       results.push(`<a>${address}</><b>@${priority}</>`);
//     }
//     return results;
//   })()).join(', ')}`);
// });

// program.parse(process.argv);
