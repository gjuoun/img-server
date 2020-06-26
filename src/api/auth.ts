import { Context, HttpError } from "../deps.ts";

export function auth() {
  return (ctx: Context<any>, next: Function) => {
    ctx.req.user = "user"
    if (ctx.req.user) {
      next();
    } else {
      throw new HttpError("username or password is wrong", 401)
    }
  }
}