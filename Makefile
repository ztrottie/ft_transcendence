
all:
	docker-compose -f "./srcs/docker-compose.yml" -p transcendence up -d

stop:
	docker-compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: nuke stop

nuke:
	echo "y\r" | ./docker-utils.sh

re: fclean all

test: fclean
	docker-compose -f "./srcs/docker-compose-test.yml" -p transcendence-test up -d
	./buildTest.sh

.PHONY: all stop fclean re nuke