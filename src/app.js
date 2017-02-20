'use strict';

var net = require('net');
var restify = require('restify');
var localServer = net.createServer();
var httpServer = restify.createServer();
var getIP = require('external-ip')();
var clients = [];

var hostip;

getIP(function (err, ip) {
  if (err) {
      throw err;
  }
  hostip = ip;
});

function findClient(hostname) {
  return clients.find(x => x.hostname === hostname);
}

localServer.on('connection', conn => {
  var hostname, mac, ip, port;
  conn.setEncoding('utf8');
  conn.on('data', join);
  conn.once('close', leave);
  conn.on('error', leave);

  function join(d) {
    [hostname,mac,ip,port] = d.replace(/(\r\n|\n|\r)/gm," ").split(' ');
    clients.push({ hostname, mac, ip, port });
    console.log('added '+hostname);
  }

  function leave() {
    var index = clients.indexOf(findClient(ip));
    clients.splice(index, 1);
    console.log('closed '+hostname);
  }
});

localServer.listen(5000, () => console.log('server listening to %j', localServer.address()));

httpServer.listen(3000);

function reply(body, res) {
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain'
  });
  res.write(body);
  res.end();
}

httpServer.get('/', (req, res, next) => {
  var body = '';
  for(var i in clients) {
    body = body + clients[i].hostname + ' ' + clients[i].ip + ':' + clients[i].port + '\r\n';
  }
  reply(body, res);
});

httpServer.get('/:hostname', (req, res, next) => {
  var client = findClient(req.params.hostname);
  if(client === undefined) {
    reply('no-such-hostname', res);
  } else {
    reply('-p ' + client.port + ' ' + hostip, res);
  }
});
