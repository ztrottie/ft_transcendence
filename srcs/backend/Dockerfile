FROM python:3.9-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /backend

ENV PYTHONUNBUFFERED=1

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

WORKDIR /backend/backend

COPY tools/start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT [ "/start.sh" ]
