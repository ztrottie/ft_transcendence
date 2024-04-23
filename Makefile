
all:
	docker-compose -f "./srcs/docker-compose.yml" -p transcendence up

stop:
	docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: stop nuke

nuke:
	echo "y\r" | ./docker-utils.sh

re: fclean all

testbuild: re
	docker-compose -f "./srcs/docker-compose.yml" -p transcendence up -d
	./buildTest.sh

.PHONY: all stop fclean re nuke