#!/bin/bash

test "$port_min" || port_min="10000" 
test "$port_max" || port_max="11000"

test "$server_port" || server_port="26"
test "$server"   || server="caioalonso.com"

test "$ssh_port" || ssh_port="26"
test "$ssh_host" || ssh_host="127.0.0.1"

test "$ssh_opts" || ssh_opts="-t -t -o BatchMode=yes -o ExitOnForwardFailure=yes -o ConnectTimeout=30 -o ServerAliveInterval=180 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no" 

function ip_address() {
  curl -s http://ipecho.net/plain
}

function mac_address() {
  cat /sys/class/net/$(ip route get 8.8.8.8 2>/dev/null| awk '{print $5}')/address
}

port=$port_min
hostname=$(hostname)

while true
do
  ssh -g -R 0.0.0.0:${port}:${ssh_host}:${ssh_port} $ssh_opts -p $server_port $server \
    "while true
      do
        echo $hostname $(mac_address) $(ip_address) $port | netcat localhost 5000
      done"
  port=`expr $port + 1`
  test $port -ge $port_max && port=$port_min
  sleep 10
done
