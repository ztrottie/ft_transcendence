
all:
	docker-compose -f "./srcs/docker-compose.yml" -p transcendence up

stop:
	docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: nuke stop

nuke:
	./docker-utils.sh

re: fclean all

.PHONY:
	all stop fclean re nuke