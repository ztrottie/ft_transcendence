
all:
	docker-compose -f "./srcs/docker-compose.yml" -p transcendence up

stop:
	@docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: stop nuke

nuke:
	./docker-utils.sh

re: fclean all

.PHONY:
	all clean fclean re nuke