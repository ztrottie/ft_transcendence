#!/bin/sh

docker container exec backend python manage.py test --noinput
EXIT_STATUS=$?
if [ $EXIT_STATUS -eq 0 ]; then
  echo "all tests passed successfully"
elif [ $EXIT_STATUS -eq 1 ]; then
  echo "at least one test failed, please correct it"
else
  echo "there is a problem in the tests code, please correct it"
fi
exit $EXIT_STATUS