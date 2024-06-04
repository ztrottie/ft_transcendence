#!/bin/sh

check_postgres_ready() {
    pg_isready -h database -p 5432
    if [ $? -eq 0 ]; then
        echo "PostgreSQL is up and running"
        return 0
    else
        echo "PostgreSQL is not ready yet"
        return 1
    fi
}

while ! check_postgres_ready; do
    sleep 5
done

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000