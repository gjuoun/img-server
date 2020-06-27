# Simple Image Server

### Features

- #### Deno runtime

  - Written in Typescript
  - Used Deligenius framework

- #### Security first

  - **Authorization and Access Control**

    - API endpoints: `/register` and `/login` are ready to use
    - `register` operation hashes user's password and stores it in db
    - User needs `Authorization: Bearer <token>` header to upload, delete, and fetch images
    - User can only access their own images

  - **JSON Web Token(JWT) support**

    - In each successful `/login`, server generates a unique `token` and `refreshToken`
    - `token` needs to be presented at `Authorization: Bearer <token>` before any operations
    - `token` is valid for 30 seconds by default, you don't need to worry about token is being stolen
    - In order to get a new `token`, you need `refreshToken` to fetch it
    - `refreshToken` is valid for a longer period of time. If `refreshToken` is known to be stolen, `refreshToken` will be reset or removed. (to be implement)
    - `/logout` resets `refreshToken`. (to be implement)

  - **Robust error handling**
    - No `null` value
    - Every piece of code is well designed which handles every possible errors
    - Every returned data/error comes with a Http status code with the same pattern:
      ```ts
      {
        success: boolean,
        message?: string,
        data?: object
      }
      ```
    - Deligenius has a default error handler, which always returns 404 if any unexpected error happens
    - Thanks to Typescript for providing strong typing experience

- #### Production ready