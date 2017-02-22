'use strict'
var net = require('net')
var config = require('./config')
var clients = require('./clients')

var localServer = function () {
  var server = net.createServer()

  server.on('connection', conn => {
    var hostname, mac, ip, port
    conn.setEncoding('utf8')
    conn.on('data', join)
    conn.once('close', leave)
    conn.on('error', leave)

    function join (d) {
      [hostname, mac, ip, port] = d.replace(/(\r\n|\n|\r)/gm, ' ').split(' ')
      clients.addClient({ hostname, mac, ip, port })
      console.log('added ' + hostname)
    }

    function leave () {
      clients.removeClient(hostname)
      console.log('removed ' + hostname)
    }
  })

  server.listen(config.localServer.port,
    () => console.log('server listening to %j', server.address())
  )
}

module.exports = localServer
