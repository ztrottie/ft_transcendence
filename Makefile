
all:
	docker compose -f "./srcs/docker-compose.yml" -p transcendence up -d
	@echo "Pour te connecter a la DB, tu dois mettre le port: " && docker ps --format "{{.Ports}}" | grep '\->' | cut -d ':' -f 2 | cut -d '-' -f 1

stop:
	echo "Removing database..."
	@docker stop database
	@docker rm database
	docker compose -f "./srcs/docker-compose.yml" down --rmi all

fclean: nuke

nuke:
	echo "y\r" | ./docker-utils.sh

re: fclean all

test: fclean
	docker compose -f "./srcs/docker compose-test.yml" -p transcendence-test up -d

.PHONY: all stop fclean re nuke