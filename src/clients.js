'use strict'

var clients = []
var Clients = {
  getAll: () => clients,
  findClient: function (hostname) {
    return clients.find(x => x.hostname === hostname)
  },
  addClient: function (client) {
    clients.push(client)
  },
  removeClient: function (hostname) {
    var index = clients.indexOf(Clients.findClient(hostname))
    clients.splice(index, 1)
  }
}

module.exports = Clients
