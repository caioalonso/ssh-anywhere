# SSH Anywhere

Automates the creation and tracking of SSH reverse tunnels so that I don't have to remember my desktop's IP when accessing it from somewhere else.

## Usage

Let's say you have a computer with the hostname `desktop`. If it is connected to the internet, no matter where, you can:
```
ssha desktop
```

## Requirements

On your remote server:
* netcat
* nodejs
* npm or yarn

## Installation

### On your remote server
```
git clone https://github.com/CaioAlonso/ssh-anywhere
cd ssh-anywhere
yarn
yarn start
```

Edit `src/config.js` to fit your needs.

You'll have an HTTP server running on port 3000 by default. You might want to open that port on your firewall. Open the 10000-11000 range too, as that will be used by your machines.

Add this to the end of your `/etc/ssh/sshd_config`:
```
GatewayPorts yes
```

### On each of your machines
```
wget https://raw.githubusercontent.com/CaioAlonso/ssh-anywhere/master/src/ssh-loop.sh
chmod +x ssh-loop.sh
```

Edit `ssh-loop.sh` with your server address and port and then run it.

Now you can do:
```
ssh `curl your.server/the-hostname-you-want`
```

Or if you're lazy, put this in your `.bashrc`:
```
ssha () {
  ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no `curl --silent http://your.server:3000/$1`
}
```

Now you can:
```
ssha the-hostname-you-want
```

### systemd service

Edit `src/ssh-loop.service` to fit your username and directory, then:

```
sudo cp src/ssh-loop.service /etc/systemd/system
sudo systemctl enable ssh-loop
sudo systemctl start ssh-loop
```
