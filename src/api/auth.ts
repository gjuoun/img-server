import { Context, HttpError } from "../deps.ts";

export function auth() {
  return (ctx: Context<any>, next: Function) => {
    ctx.req.user = {userId: 2}
    if (ctx.req.user) {
      next();
    } else {
      throw new HttpError("unauthorized user", 401)
    }
  }
}