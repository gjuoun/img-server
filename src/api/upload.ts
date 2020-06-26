import { Context, HttpError, multiParser, FormFile } from "../deps.ts";
import { config } from '../config/config.ts'
import { METHOD } from '../types/types.ts'

export function uploadImg() {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/upload" &&
      ctx.req.method === METHOD.POST) {

      const form = await multiParser(ctx.req, config.maxFileSize)
      const user = ctx.req.user

      // multiple files upload
      if (form?.multiple instanceof Array) {
        for (let file of form.multiple) {
          const filename = <FormFile>file.filename
          const path = `./img/${user}/${filename}`
          Deno.writeFile(path, (<FormFile>file).content!, { create: true })
        }
        ctx.status(201).send({ success: true, message: "successful upload multiple files" })
      }
      // single file upload
      else if (typeof form?.multiple === "object") {
        const path = `./img/${user}/${(form.multiple as FormFile).filename}`
        Deno.writeFile(path, (form.multiple as FormFile).content!, { create: true })
        ctx.status(201).send({ success: true, message: "successful upload single file" })
      }
      // the field is string
      else {
        throw new HttpError("only file upload is allowed", 400)
      }
    } else {
      next()
    }
  }
}