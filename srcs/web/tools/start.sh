#!/bin/sh

is_backend_ready() {
    curl -s -o /dev/null "http://backend:8000"
    if [ $? -eq 0 ]; then
        echo "Backend is running"
		return 0;
    else
		echo "Backend is not running"
        return 1;
    fi  
}

while ! is_backend_ready; do
    sleep 5
done

echo "launching nginx server.."
nginx -g "daemon off;"