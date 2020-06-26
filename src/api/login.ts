import { mid, Context, HttpError } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import userService from '../services/user.ts'


export function login() {
  return async (ctx: Context<any>, next: Function) => {
    if (ctx.req.url === "/api/login" && ctx.req.method === METHOD.POST) {
      let json = ctx.req.json
      if (json.username && json.password) {
        const user = await userService.getUserByUsername(json.username)
        if (!user) {
          throw new HttpError("no user found, username=" + json.username, 400)
        }

        if (user.password !== json.password) {
          throw new HttpError("password is wrong, username=" + json.username, 400)
        }

        ctx.send({
          success: true,
          data: {
            user: {
              id: user.id,
              username: user.username
            }
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