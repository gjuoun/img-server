# FROM hayd/alpine-deno:1.1.1
FROM hayd/ubuntu-deno:latest

WORKDIR /home/app

COPY . .
EXPOSE 8000

RUN deno cache ./src/deps.ts

RUN deno cache ./src/app.ts

CMD ["run", "-A", "./src/app.ts"]

# start mysql script
# docker run --name mysql -v ${PWD}/data:/docker-entrypoint-initdb.d -e MYSQL_USER=dbuser -e MYSQL_PASSWORD=dbpassword -e MYSQL_DATABASE=test -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:5.7