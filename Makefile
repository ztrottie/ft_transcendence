
all:
	docker compose -f "./srcs/docker-compose.yml" -p transcendence up
	@echo "Pour te connecter a la DB, tu dois mettre le port: " && docker ps --filter "name=database" --format "{{.Ports}}" | grep '\->' | cut -d ':' -f 2 | cut -d '-' -f 1

# 
stop:
	echo "Removing database..."
	@docker stop database
	@docker rm database
	docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: nuke

nuke:
	@echo "NUKE the transcendence"
	@echo "y\r" | ./docker-utils.sh

re: fclean all

#this method is for the ci/cd tester
test:
	@echo "Launching the tester version of the transcendence..."
	@docker-compose -f "./srcs/docker-compose-test.yml" -p transcendence-test up -d

#install the package you need in the docker straight so no need to restart and put it in the requirements.txt so it'll be there after reboot
pipinstall:
	@echo "Launching package installation script..."
	@./pipinstall.sh

.PHONY: all stop fclean re nuke