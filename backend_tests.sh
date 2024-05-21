#!/bin/sh

docker container exec backend python manage.py test --force-input
exit $?