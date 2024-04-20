FROM nginx:1.25-alpine

COPY tools/start.sh /start.sh
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY www/ /usr/share/nginx/html

EXPOSE 80

# RUN chmod +x /start.sh
# ENTRYPOINT [ "/start.sh" ]

CMD [ "nginx", "-g", "daemon off;" ]