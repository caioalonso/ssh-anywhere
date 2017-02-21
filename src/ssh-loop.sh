#!/bin/bash

test "$port_min"           || port_min="10000"
test "$port_max"           || port_max="11000"
test "$local_ssh_port"     || local_ssh_port="26"
test "$local_ssh"          || local_ssh="localhost"
test "$remote_ssh_port"    || remote_ssh_port="26"
test "$remote_ssh"         || remote_ssh="127.0.0.1"
test "$remote_server_port" || remote_server_port="3001"

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
  ssh -g -R 0.0.0.0:${port}:${local_ssh}:${local_ssh_port} $ssh_opts -p $remote_ssh_port $remote_ssh \
    "while true
      do
        echo $hostname $(mac_address) $(ip_address) $port | netcat localhost $remote_server_port
      done"
  port=`expr $port + 1`
  test $port -ge $port_max && port=$port_min
  sleep 10
done
