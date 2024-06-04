#!/bin/bash

echo -n "Enter title of the package: "
read package

# Check if backend container is running
if docker ps | grep -q backend; then
  # Backend container is running, proceed with pip install
  docker exec -it backend sh -c "pip install $package ; pip freeze > /backend/requirements.txt"
else
  # Backend container is not running, print error message
  echo "Error: Backend container is not running."
fi