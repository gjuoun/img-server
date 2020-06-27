import { mid, Context, HttpError } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import userService from '../services/user.ts'
import jwtService from '../services/jwt.ts'

/**
 * Verify username with password
 * then return user with jwt token and refreshToken
 */

export function login() {
  return async (ctx: Context<any>, next: Function) => {
    if (ctx.req.url === "/api/login" && ctx.req.method === METHOD.POST) {
      let json = ctx.req.json
      if (json.username && json.password) {
        const user = await userService.getUserByUsername(json.username)
        if (!user) {
          throw new HttpError("no user found, username=" + json.username, 400)
        }

        // verify password
        if (!userService.isValidPassword(json.password, user.password)) {
          throw new HttpError("password is wrong, username=" + json.username, 400)
        }

        // jwt token expires after 30 seconds
        const token = jwtService.generateJwt({
          userId: user.id as number,
          exp: Date.now() + 30000,
        })

        const refreshToken = jwtService.generateJwt({
          userId: user.id as number,
        })

        ctx.send({
          success: true,
          data: {
            user: {
              id: user.id,
              username: user.username
            },
            token,
            refreshToken
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