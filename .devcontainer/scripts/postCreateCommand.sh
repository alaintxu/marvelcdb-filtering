#!/bin/bash
echo "Creating ssh config file to use 443 port instead of 22 for pushing"

# Create the .ssh directory if it doesn't exist
mkdir -p /home/node/.ssh

# Create the config file if it doesn't exist
touch /home/node/.ssh/config

cat > /home/node/.ssh/config << EOF
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
EOF
