FROM hayd/alpine-deno:1.1.1

WORKDIR /home/app

COPY deps.ts .

RUN deno cache ./src/deps.ts

RUN deno cache ./src/app.ts

CMD ["run", "-A", "./src/app.ts"]

# docker run --name mysql 
# -v ${PWD}/src/loaders/init.sql:/docker-entrypoint-initdb.d 
# -e MYSQL_USER=johngg
# -e MYSQL_PASSWORD=21346687
# -e MYSQL_DATABASE=test 
# -p 3306:3306 
# -d mysql:8