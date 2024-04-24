#!/bin/bash

sleep 300
running="$(docker-compose ps -f "./srcs/docker-compose-test.yml" --services --filter "status=running")"
services="$(docker-compose ps -f "./srcs/docker-compose-test.yml" --services)"
if [ "$running" != "$services" ]; then
    echo "Following services are not running:" 
    # Bash specific
    comm -13 <(sort <<<"$running") <(sort <<<"$services")
    exit 1
else
    echo "All services are running"
    exit 0
fi