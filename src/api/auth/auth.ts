import { Context, HttpError } from "../../deps.ts";
import jwtService from '../../services/jwt.ts'


export function auth() {
  return async (ctx: Context<any>, next: Function) => {

    if (ctx.req.headers.has("authorization")) {
      let token = getToken(ctx.req.headers.get("authorization") as string)
      let payload = await jwtService.validateJwt(token)

      // token may be expired, default 30 seconds
      if (!payload) {
        throw new HttpError("invalid token, authorization failed", 400)
      }

      // authorize user and set userId
      ctx.req.user = { userId: payload.userId }
      next()
    } else {
      throw new HttpError("unauthorized user", 401)
    }

  }
}

function getToken(authHeader: string) {
  return authHeader.split(" ")[1]
}