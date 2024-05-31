#!/bin/bash

# Reset
Reset='\033[0m'       # Text Reset

# Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

stop_all_containers() {
	if [ -z "$(docker ps -aq)" ]; then
		echo -e "${Red}No docker container are currently running${Reset}"
	else
		docker stop $(docker ps -aq) > /dev/null 2>&1
		echo -e "${Green}All docker containers currently running have been stopped🎉${Reset}"
	fi
}

clean_containers() {
	if [ -z "$(docker ps -aq)" ]; then
		echo -e "${Red}No containers found${Reset}"
	else
		if [ -n "$(docker ps -q)" ]; then
			docker stop $(docker ps -aq) > /dev/null 2>&1
			echo -e "${Green}All docker containers currently running have been stopped🎉${Reset}"
		fi
		docker rm $(docker ps -aq) > /dev/null 2>&1
		echo -e "${Green}All docker containers have been deleted🎉${Reset}"
	fi
}

clean_volumes() {
	if [ -z "$(docker volume ls)" ]; then
		echo -e "${Red}No volume found${Reset}"
	else
		docker volume rm $(docker volume ls -q) > /dev/null 2>&1
		if [ $? == 1 ]; then
			echo -e "${Red}Error happened${Reset}"
		else
			echo -e "${Green}All docker volumes have been deleted${Reset}"
		fi
	fi
}

clean_images() {
	if [ -z "$(docker images -q)" ]; then
		echo -e "${Red}No images found${Reset}"
	else
		docker rmi -f $(docker images -q) > /dev/null 2>&1
		if [ $? == 1 ]; then
			echo -e "${Red}Error happened, image is probably tied to container${Reset}"
		else
			echo -e "${Green}All docker images deleted🎉${Reset}"
		fi
	fi
}

clean_caches() {
	docker builder prune --all
}


stop_all_containers
clean_containers
clean_volumes
clean_images
clean_caches