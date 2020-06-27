import { Context, HttpError, bcrypt } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import userService from '../services/user.ts'


export function register() {
  return async (ctx: Context<any>, next: Function) => {
    if (ctx.req.url === "/api/register" && ctx.req.method === METHOD.POST) {
      const json = ctx.req.json
      if (json.username && json.password) {
        // in case of duplicated user found
        const user = await userService.getUserByUsername(json.username)
        if (user) {
          throw new HttpError("duplicated user found, username=" + json.username, 400)
        }

        // username and password have to be valid by using regex
        const { username, password } = json
        const isValid = userService.isValidUser(username, password)
        if (!isValid.valid) {
          throw new HttpError(isValid.message as string, 400)
        }

        // get insertUser result = {id: number}
        const result = await userService.insertUser(
          {
            username,
            password
          })
        if (!result) {
          throw new HttpError("unable to create user, username=" + username, 500)
        }

        ctx.send({
          success: true,
          data: {
            id: result.id
          }
        })
      } else {
        throw new HttpError("no username or password provided", 400)
      }
    } else {
      next()
    }
  }
}