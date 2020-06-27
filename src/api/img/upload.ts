import { Context, HttpError, multiParser, FormFile, posix, mime } from "../../deps.ts";
import { config } from '../../config/config.ts'
import { METHOD } from '../../types/types.ts'

import { Image } from '../../models/image.ts'
import imageService from '../../services/image.ts'

export function uploadImg(fieldName: string) {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/img/upload" &&
      ctx.req.method === METHOD.POST) {

      const form = await multiParser(ctx.req, config.app_maxFileSize)

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
  const images: Image[] = []
  const files = []
  const userId = ctx.req.user.userId

  // ensure content-type is image/*
  for (let file of form) {
    let contentType = mime.lookup(file.filename)
    if (contentType && (<string>contentType).startsWith("image")) {
      const localPath = "./" + posix.join(config.app_imgRoot, `/${userId}/${file.filename}`)
      files.push({ ...file, localPath })
    } else {
      throw new HttpError("at least one file is not image", 400)
    }
  }

  // write to local disk
  for (let file of files) {
    await writeFileToLocal(file.localPath, file.content!)

    images.push({
      user_id: userId,
      filename: file.filename,
      local_path: file.localPath
    })
  }

  // save to db
  let result = await imageService.insertManyImages(images)
  if (result) {
    // add ids to returned images
    let newImages = images.map((image, index) => {
      return {
        id: result![index].id,
        user_id: image.user_id,
        filename: image.filename
      }
    })

    // send out response
    ctx.status(201).send({
      success: true,
      data: {
        images: newImages
      }
    })
  } else {
    throw new HttpError("insert multiple images error", 400)
  }
}


async function handleSingleUpload(ctx: Context<any>, file: FormFile) {
  const userId = ctx.req.user.userId

  const contentType = mime.lookup(file.filename)
  // ensure content-type is image/*
  if (!contentType || !(<string>contentType).startsWith("image")) {
    throw new HttpError("uploaded file is not image", 400)
  }

  const localPath = "./" + posix.join(config.app_imgRoot, `/${userId}/${file.filename}`)
  await writeFileToLocal(localPath, file.content!)

  let image: Image = {
    user_id: userId,
    filename: file.filename,
    local_path: localPath
  }

  let result = await imageService.insertImage(image)

  if (result) {
    // add id field to image
    let newImage = {
      user_id: image.user_id,
      id: result.id,
      filename: image.filename
    }

    ctx.status(201).send({
      success: true,
      data: {
        images: [newImage]
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