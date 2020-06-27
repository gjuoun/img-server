import { Context, HttpError, mid, posix} from "../../deps.ts";
import { METHOD } from '../../types/types.ts'
import imageService from '../../services/image.ts'
import {config} from '../../config/config.ts'

export function deleteImg() {
  return (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/img/delete" &&
      ctx.req.method === METHOD.DELETE) {
      let json: any = ctx.req.json
      let {userId} = ctx.req.user
      if (json?.filename) {
        const path = `./`+ posix.join(`/${userId}/${json.filename}`)
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