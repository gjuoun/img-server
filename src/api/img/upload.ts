import {
  Context, HttpError,
  multiParser, FormFile, multiParserV2, FormV2, FormFileV2,
  posix, mime, ensureFileSync
} from "../../deps.ts";

import { config } from '../../config/config.ts'
import { METHOD } from '../../types/types.ts'

import { Image } from '../../models/image.ts'
import imageService from '../../services/image.ts'

export function uploadImg(fieldName: string) {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/img/upload" &&
      ctx.req.method === METHOD.POST) {

      // const form = await multiParser(ctx.req, config.app_maxFileSize)
      const form = await multiParserV2(ctx.req)

      if (!form || !form.files[fieldName]) {
        throw new HttpError("no such field exists in upload, field=" + fieldName, 400)
      }

      let files = form.files[fieldName]

      // multiple files upload
      if (files instanceof Array) {
        await handleMultipleUpload(ctx, files)
      }
      // single file upload
      else {
        // await handleSingleUpload(ctx, files as FormFileV2)
        await handleMultipleUpload(ctx, [files])
      }
    } else {
      next()
    }
  }
}

async function handleMultipleUpload(ctx: Context<any>, form: FormFileV2[]) {
  const images: Image[] = []
  const files = []
  const userId = ctx.req.user.userId

  for (let file of form) {
    // ensure there is no duplicate images
    let imageResult = await imageService.getImageByFilename(userId, file.filename)

    // ensure content-type is image/*
    let contentType = file.contentType
    if (contentType && contentType.startsWith("image")) {
      const localPath = "./" + posix.join(config.app_imgRoot, `/${userId}/${file.filename}`)
      // skip duplicated images
      if (!imageResult) {
        files.push({ ...file, localPath })
      }
    } else {
      throw new HttpError("at least one uploaded file is not image", 400)
    }
  }

  // write to local disk
  for (let file of files) {
    writeFileToLocal(file.localPath, file.content)

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


function writeFileToLocal(path: string, content: Uint8Array) {

  ensureFileSync(path)
  // no need to wait
  Deno.writeFile(path, content)
}