/**
 * Generate new token by refreshToken
 */


import { mid, Context, HttpError } from "../../deps.ts";
import { METHOD } from '../../types/types.ts'
import jwtService from '../../services/jwt.ts'

export function token() {
  return async (ctx: Context<any>, next: Function) => {
    if (ctx.req.url === "/api/auth/token" && ctx.req.method === METHOD.POST) {
      let json = ctx.req.json
      if (json.refreshToken) {
        let payload = await jwtService.validateJwt(json.refreshToken)

        if (!payload) {
          throw new HttpError("invalid refreshToken", 400)
        }

        let userId = payload.userId
        const token = jwtService.generateJwt(
          {
            userId,
            exp: Date.now() + 30000, //token expires after 30 seconds
          }
        )
        ctx.send({
          success: true,
          data: {
            token
          }
        })

      } else {
        throw new HttpError("no refreshToken is provided", 400)
      }
    } else {
      next()
    }
  }
}