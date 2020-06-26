import { Context, HttpError, mid, } from "../deps.ts";
import { METHOD } from '../types/types.ts'


export function deleteImg() {
  return mid.json(), (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/delete" &&
      ctx.req.method === METHOD.DELETE) {
      let json: any = ctx.req.json
      let user = ctx.req.user
      if (json?.filename) {
        const path = `./img/${user}/${json.filename}`
        try {
          Deno.remove(path)
          ctx.send({ succes: true, message: `successful delete file: ${json.filename}` })
        } catch (e) {
          ctx.status(400).send({ success: false, message: `cannot find file: ${json.filename}` })
        }
      } else {
        throw new HttpError("no filename is provided", 404)
      }
    }
    else {
      next()
    }
  }
}