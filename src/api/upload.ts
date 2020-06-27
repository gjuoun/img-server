import { Context, HttpError, multiParser, FormFile, posix } from "../deps.ts";
import { config } from '../config/config.ts'
import { METHOD } from '../types/types.ts'

import { Image } from '../models/image.ts'
import imageService from '../services/image.ts'

export function uploadImg(fieldName: string) {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/upload" &&
      ctx.req.method === METHOD.POST) {

      const form = await multiParser(ctx.req, config.maxFileSize)

      if (!form || !form[fieldName]) {
        throw new HttpError("no such field exists in upload, field=" + fieldName, 400)
      }

      let files = form[fieldName]

      // multiple files upload
      if (files instanceof Array) {
        await handleMultipleUpload(ctx, files)
      }
      // single file upload
      else if (typeof files === "object") {
        await handleSingleUpload(ctx, files as FormFile)
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

async function handleMultipleUpload(ctx: Context<any>, form: FormFile[]) {
  let images: Image[] = []
  const userId = ctx.req.user.userId

  for (let file of form) {
    const localPath = "./" + posix.join(config.imgRoot, `/${userId}/${file.filename}`)
    await writeFileToLocal(localPath, file.content!)

    images.push({
      user_id: userId,
      filename: file.filename,
      local_path: localPath
    })
  }

  let result = await imageService.insertManyImages(images)
  if (result) {
    ctx.status(201).send({
      success: true,
      data: {
        images
      }
    })
  } else {
    throw new HttpError("insert multiple images error", 400)
  }
}


async function handleSingleUpload(ctx: Context<any>, file: FormFile) {
  let images: Image[] = []
  const userId = ctx.req.user.userId

  // const userFolder = "./" + posix.join(config.imgRoot, `/${userId}`)
  const localPath = "./" + posix.join(config.imgRoot, `/${userId}/${file.filename}`)
  await writeFileToLocal(localPath, file.content!)

  images.push({
    user_id: userId,
    filename: file.filename,
    local_path: localPath
  })

  let result = await imageService.insertImage(images[0])
  if (result) {
    ctx.status(201).send({
      success: true,
      data: {
        images
      }
    })
  } else {
    throw new HttpError("insert single image error", 400)
  }
}

async function writeFileToLocal(path: string, content: Uint8Array) {
  let parsedFile = posix.parse(path)
  try {
    // try to read to folder
    await Deno.stat(parsedFile.dir)
  } catch{
    // folder doesn't exist
    Deno.mkdirSync(parsedFile.dir)
  }

  Deno.writeFile(`${parsedFile.dir}/${parsedFile.base}`, content)
}