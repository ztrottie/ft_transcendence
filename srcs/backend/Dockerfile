FROM python:3.9-alpine

WORKDIR /backend

ENV PYTHONUNBUFFERED=1

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

WORKDIR /backend/backend

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]