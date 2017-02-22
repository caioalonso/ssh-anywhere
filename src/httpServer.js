'use strict'
var restify = require('restify')
var config = require('./config')
var clients = require('./clients')
var getIP = require('external-ip')()
var hostip

var httpServer = function () {
  getIP(function (err, ip) {
    if (err) {
      throw err
    }
    hostip = ip
  })

  var server = restify.createServer()
  server.listen(config.httpServer.port)

  function reply (status, body, res) {
    res.writeHead(status, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/plain'
    })
    res.write(body)
    res.end()
  }

  server.get('/', (req, res, next) => {
    var body = ''
    var arr = clients.getAll()
    for (var i in arr) {
      body = body + arr[i].hostname + ' ' + arr[i].ip + ':' + arr[i].port + '\r\n'
    }
    reply(200, body, res)
  })

  server.get('/:hostname', (req, res, next) => {
    var client = clients.findClient(req.params.hostname)
    if (client === undefined) {
      reply(404, 'no-such-hostname', res)
    } else {
      reply(200, '-p ' + client.port + ' ' + hostip, res)
    }
  })
}

module.exports = httpServer
