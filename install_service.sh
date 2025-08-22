#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Copy service file to system directory
echo "Installing AIRA service..."
sudo cp aira.service /etc/systemd/system/

# Reload systemd to recognize the new service
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable the service to start at boot
echo "Enabling AIRA service to start at boot..."
sudo systemctl enable aira.service

# Start the service
echo "Starting AIRA service..."
sudo systemctl start aira.service

# Check status
echo "Checking service status..."
sudo systemctl status aira.service

echo "AIRA service has been installed and started!"
echo "You can manage it using the following commands:"
echo "  sudo systemctl start aira.service   - Start the service"
echo "  sudo systemctl stop aira.service    - Stop the service"
echo "  sudo systemctl restart aira.service - Restart the service"
echo "  sudo systemctl status aira.service  - Check service status"
