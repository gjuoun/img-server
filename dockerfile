FROM hayd/alpine-deno:1.1.1

WORKDIR /home/app

COPY . .
EXPOSE 8000

RUN deno cache ./src/deps.ts

RUN deno cache ./src/app.ts

CMD ["run", "-A", "./src/app.ts"]

# docker run --name mysql 
# -v ${PWD}/data:/docker-entrypoint-initdb.d 
# -e MYSQL_USER=johngg
# -e MYSQL_PASSWORD=21346687
# -e MYSQL_DATABASE=test 
# -p 3306:3306 
# -d mysql:8

# docker run --name mysql -v ${PWD}/data:/docker-entrypoint-initdb.d -e MYSQL_USER=johngg -e MYSQL_PASSWORD=21346687 -e MYSQL_DATABASE=test -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:5.7