#!/bin/bash

sleep 180
running="$(docker-compose -f "./srcs/docker-compose-test.yml" -p transcendence-test ps --services --filter "status=running")"
services="$(docker-compose -f "./srcs/docker-compose-test.yml" -p transcendence-test ps --services)"
if [ "$running" != "$services" ]; then
    echo "Following services are not running:" 
    # Bash specific
    comm -13 <(sort <<<"$running") <(sort <<<"$services")
    exit 1
else
    echo "All services are running"
    exit 0
fi