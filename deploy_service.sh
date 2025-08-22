#!/bin/bash

# Make script exit if any command fails
set -e

# Print each command before executing
set -x

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (use sudo)"
  exit 1
fi

# Define variables
PROJECT_DIR="/home/shrihari/Desktop/AIRA"
SERVICE_NAME="aira.service"
SERVICE_PATH="/etc/systemd/system/${SERVICE_NAME}"

echo "Deploying AIRA as a system service..."

# Copy service file to systemd directory
cp "${PROJECT_DIR}/${SERVICE_NAME}" "${SERVICE_PATH}"

# Reload systemd to recognize the new service
systemctl daemon-reload

# Enable and start the service
systemctl enable "${SERVICE_NAME}"
systemctl start "${SERVICE_NAME}"

# Check service status
systemctl status "${SERVICE_NAME}"

echo "AIRA service has been deployed and started!"
echo "Use the following commands to manage the service:"
echo "- Check status: sudo systemctl status ${SERVICE_NAME}"
echo "- Stop service: sudo systemctl stop ${SERVICE_NAME}"
echo "- Start service: sudo systemctl start ${SERVICE_NAME}"
echo "- View logs: sudo journalctl -u ${SERVICE_NAME} -f"
