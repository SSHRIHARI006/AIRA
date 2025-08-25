#!/bin/bash

# AIRA Clean and Build Script
# This script completely clears all cache and builds everything from scratch

set -e  # Exit on any error

echo "Starting complete cleanup and rebuild process..."

# Stop any running containers
echo "Stopping all running containers..."
sudo docker-compose down 2>/dev/null || true
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true

# Remove all containers
echo "Removing all containers..."
sudo docker rm -f $(sudo docker ps -aq) 2>/dev/null || true
sudo docker container prune -f

# Remove all images
echo "Removing all Docker images..."
sudo docker rmi -f $(sudo docker images -aq) 2>/dev/null || true
sudo docker image prune -af

# Remove all volumes
echo "Removing all Docker volumes..."
sudo docker volume rm $(sudo docker volume ls -q) 2>/dev/null || true
sudo docker volume prune -f

# Remove all networks (except default ones)
echo "Removing all Docker networks..."
sudo docker network prune -f

# Complete Docker system cleanup
echo "Running complete Docker system cleanup..."
sudo docker system prune -af --volumes

# Clear Python cache
echo "Clearing Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true
find . -name "*.pyd" -delete 2>/dev/null || true
find . -name ".coverage" -delete 2>/dev/null || true
find . -name "*.cover" -delete 2>/dev/null || true
find . -name "*.log" -delete 2>/dev/null || true

# Clear Node.js cache (if exists)
echo "Clearing Node.js cache..."
rm -rf frontend/node_modules 2>/dev/null || true
rm -rf frontend/.next 2>/dev/null || true
rm -rf frontend/dist 2>/dev/null || true
rm -rf frontend/build 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Clear pip cache
echo "Clearing pip cache..."
pip cache purge 2>/dev/null || true

# Clear system package cache
echo "Clearing system package cache..."
sudo apt-get clean 2>/dev/null || true
sudo apt-get autoclean 2>/dev/null || true

# Build everything from scratch
echo "Building everything from scratch..."

# Install/update Node.js dependencies
if [ -d "frontend" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Build with no cache
echo "Building Docker images with no cache..."
sudo docker-compose build --no-cache --pull

# Start the application
echo "Starting the application..."
sudo docker-compose up -d

# Show status
echo "Build complete! Checking status..."
sudo docker-compose ps

echo "Complete cleanup and rebuild finished!"
