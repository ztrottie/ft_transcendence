
all:
	@echo "Launching the transcendence..."
	@docker-compose -f "./srcs/docker-compose.yml" -p transcendence up -d

stop:
	@echo "Stopping the transcendence..."
	@docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: nuke stop

nuke:
	@echo "NUKE the transcendence"
	@echo "y\r" | ./docker-utils.sh

re: fclean all

#this method is for the ci/cd tester
test: fclean
	@echo "Launching the tester version of the transcendence..."
	@docker-compose -f "./srcs/docker-compose-test.yml" -p transcendence-test up -d

#install the package you need in the docker straight so no need to restart and put it in the requirements.txt so it'll be there after reboot
pipinstall:
	@echo "Launching package installation script..."
	@./pipinstall.sh

.PHONY: all stop fclean re nuke