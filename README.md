# Simple Image Server

> Simple image server allows users to save and download photos privately. Users can register and login to the server, upload or delete their pictures. Since the server is highly secure, it empowers users to build their own private photo gallery.

### Quick start

Requirement: [Docker](https://www.docker.com/)

Clone this repository

```bash
> git clone https://github.com/gjuoun/img-server.git
> cd ./img-server
```

Run with docker-compose

```bash
> docker-compose up
```

**The server runs on `localhost:8000` by default, unless you provide `APP_PORT=<port>` at `docker-compose.yml`**

To stop the servers, press `CTRL+C`, or type:

```bash
> docker-compose stop
```

To restart the servers, type:

```bash
> docker-compose start
```

To shutdown, type:

```bash
> docker-compose down
```

Note:
* You can bring your own data to the container, just put `.sql` files into `./data` folder. Every time `docker-compose up`, MySQL executes those `.sql` scripts automatically.

### Running on local

Requirement:

- [Deno runtime](https://deno.land/#installation)
- A [MySQL database](https://www.mysql.com/) instance, it can be local or remote

First, clone this repo

```bash
> git clone https://github.com/gjuoun/img-server.git
> cd ./img-server
```

then you need to configure the environment variables, by copying `.env.example` as `.env` to the root folder. There are few fields you need to change in `.env` file, make sure they match your `MySQL` instance configuration:

```HTML
...
MYSQL_HOSTNAME=localhost
MYSQL_PORT=3306
MYSQL_USER=dbuser
MYSQL_PASSWORD=dbpassword
MYSQL_DATABASE=test
...
```

Now you should be ready to go, let's run `./src/app.ts`

```bash
> deno run -A ./src/app.ts
```

**The server runs on `localhost:8000` by default, unless you provide `APP_PORT=<port>` at `.env`**

Note:

- `-A` is a shortcut to allow all the permissions including network and file permission. [Read more about permissions in Deno](https://deno.land/manual/getting_started/permissions#permissions-list)
- `Deno` caches dependencies in local, sometimes you may want to reload the app with updated dependencies. You can add `--reload` flag in `run` command to achieve that.

```bash
> deno run -A --reload ./src/app.ts
```

### Table of contents

- [Highlights](#highlights)
  - [Tech stack](#tech-stack)
  - [Security first](#security-first)
  - [Development friendly](#development-friendly)
- [Server Overview](#server-overview)
- [API endpoints](#api-endpoints)
  - [POST /api/auth/register](#post-apiauthregister)
  - [POST /api/auth/login](#post-apiauthlogin)
  - [POST /api/auth/token](#post-apiauthtoken)
  - [POST /api/img/upload](#post-apiimgupload)
  - [DELETE /api/img/delete](#delete-apiimgdelete)
  - [GET /api/img/all](#get-apiimgall)
  - [GET /:userId/:filename](#get-useridfilename)

---

### Highlights

#### Tech stack

- Deno runtime
- Written in Typescript
- Used Deligenius framework(Deno)
- Database: MySQL
- Docker

#### Security first

- **Authorization and Access Control**

  - API endpoints: `/register` and `/login` are ready to use
  - `register` operation hashes user's password and stores it in DB
  - User needs `Authorization: Bearer <token>` header to upload, delete, and fetch images
  - User can only access their own images

- **JSON Web Token(JWT) support**

  - In each successful `/login`, server generates a unique `token` and `refreshToken`.
  - `token` needs to be presented at `Authorization: Bearer <token>` header for authorization purpose.
  - `token` is valid for 30 seconds by default, you don't need to worry about stolen tokens.
  - In order to get a new `token`, the `refreshToken` must be presented.
  - `refreshToken` is valid for a longer period of time. If `refreshToken` is known to be stolen, `refreshToken` will be reset or removed. (to be implement)
  - `/logout` resets `refreshToken`. (to be implement)

- **Robust code**

  - No `null` value
  - Every piece of code is well designed which handles every possible error
  - Deligenius has a default error handler, which always returns 404 if any unexpected error happens
  - Every returned data/error comes with a Http status code with the same pattern:

    ```ts
    {
      success: boolean,
      message?: string,
      data?: object
    }
    ```

  - Thanks to Typescript for providing strong typing experience
  - Tests (to be implemented)

#### Developer friendly

- **Running on local**
  - `.env` allows you to customize the server while developing on local
- **Running in containers**
  - `dockerfile` and `docker-compose` are provided
  - You can build your own image and deploy it to anywhere

## [🔝](#table-of-contents)

### Server Overview

![server overview](/docs/overview.png "server overview")

## [🔝](#table-of-contents)

### API endpoints

#### `POST /api/auth/register`

> allows user to register with `username` and `password`

Request:

```http
POST http://localhost:8000/api/auth/register HTTP/1.1
content-type: application/json

{
    "username": "johnguo",
    "password": "mypassword"
}
```

A successful response:

```http
HTTP/1.1 200 OK
content-length: 32
content-type: application/json

{
  "success": true,
  "data": {
    "id": 2
  }
}
```

## [🔝](#table-of-contents)

#### `POST /api/auth/login`

> allows user to login with `username` and `password`


Request:

```http
POST http://localhost:8000/api/auth/login HTTP/1.1
content-type: application/json

{
    "username": "johnguo",
    "password": "mypassword"
}
```

A successful response:

- `token` and `refreshToken` both are JSON web tokens. After validate JWT you will find its `payload = {userId: number, exp: number}`
- `token` will be used for authorization, it expires after 30 seconds.
- `refreshToken` will be used at `POST /api/auth/token`

```http
HTTP/1.1 200 OK
content-length: 280
content-type: application/json

{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "username": "johnguo"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImV4cCI6MTU5MzI1NzY2MjgyNH0.T6tv1_0830as9ktTIx2cTmgVroZjYS26pGsjCIS9O-8",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.C-H4Nxs0f-W_397n8xL3HB05rNenUXeOoRXm3UbUoxE"
  }
}
```

## [🔝](#table-of-contents)

#### `POST /api/auth/token`

> returns new JWT`token` by a given `refreshToken`

Request:

```http
POST http://localhost:8000/api/auth/token HTTP/1.1
content-type: application/json

{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.C-H4Nxs0f-W_397n8xL3HB05rNenUXeOoRXm3UbUoxE"
}
```

A successful response:

- `token` as mentioned, it expires after 30 seconds. Clients must provide `refreshToken` to get a new `token`

```http
HTTP/1.1 200 OK
content-length: 144
content-type: application/json

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImV4cCI6MTU5MzI1ODAyMDc0MH0.Zy6G7YyI-gLQa2VB6zNpdaGV7FcwgOowBLQxUxpuz0I"
  }
}
```

## [🔝](#table-of-contents)

#### `POST /api/img/upload`

> allows authorized user to upload images

Notice in the header `Authorization: Bearer <token>` and `token` must be provided.

Also, in `.env` file, `APP_IMGFIELD` **must match** the form field with image files.

```
...
APP_IMGFIELD=multiple
...
```

Request:

```http
POST http://localhost:8000/api/img/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Authorization: Bearer <token>

...file content...
```

A successful response:

```http
HTTP/1.1 200 OK
content-length: 76
content-type: application/json

{
  "success": true,
  "data": {
    "images": [
      {
        "user_id": 2,
        "filename": "2.jpg",
        "id": 2
      }
    ]
  }
}
```

- `data.images` is the type of `Image[]`, where:

```ts
interface Image {
  id: number;
  user_id: number;
  filename: string;
}
```

## [🔝](#table-of-contents)

#### `DELETE /api/img/delete`

> allows user to delete their image by a given image `id`

Notice in the header `Authorization: Bearer <token>` and `token` must be provided.

Request:

```http
DELETE http://localhost:8000/api/img/delete HTTP/1.1
content-type: application/json
Authorization: Bearer <token>

{
    "id": 2
}
```

A successful response:

```http
HTTP/1.1 200 OK
content-length: 120
content-type: application/json

{
  "success": true,
  "message": "successful delete file: 2.jpg, id=2",
  "data": {
    "image": {
      "id": 2,
      "user_id": 2,
      "filename": "2.jpg"
    }
  }
}
```

## [🔝](#table-of-contents)

#### `GET /api/img/all`

> returns the authorized user's images information in json format

Notice in the header `Authorization: Bearer <token>` and `token` must be provided.

Request:

```http
GET http://localhost:8000/api/img/all HTTP/1.1
Authorization: Bearer <token>
```

A successful response: 

```http
HTTP/1.1 200 OK
content-length: 76
content-type: application/json

{
  "success": true,
  "data": {
    "images": [
      {
        "id": 1,
        "user_id": 2,
        "filename": "2.jpg"
      }
    ]
  }
}
```

## [🔝](#table-of-contents)

#### `GET /:userId/:filename`

> returns static image file to the authorized user

Notice in the header `Authorization: Bearer <token>` and `token` must be provided.

Request:

```http
GET http://localhost:8000/2/2.jpg HTTP/1.1
Authorization: Bearer <token>
```

Response is a static image file:

```http
HTTP/1.1 200 OK
content-length: 94402
content-type: image/jpeg
```

## [🔝](#table-of-contents)



