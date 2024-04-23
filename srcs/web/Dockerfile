FROM nginx:1.25-alpine

RUN apk update && apk add openssl

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY www/ /usr/share/nginx/html

EXPOSE 443

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/ssl/key.key -out /etc/nginx/ssl/cert.crt -sha256 -days 3650 -nodes -subj "/C=CA/ST=Quebec/L=Quebec/O=42/OU=ztrottie/CN=localhost"

COPY tools/start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT [ "/start.sh" ]