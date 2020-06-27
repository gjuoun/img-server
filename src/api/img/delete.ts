import { Context, HttpError, mid, posix } from "../../deps.ts";
import { METHOD } from '../../types/types.ts'
import imageService from '../../services/image.ts'
import { config } from '../../config/config.ts'

export function deleteImg() {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/img/delete" &&
      ctx.req.method === METHOD.DELETE) {
      let json = ctx.req.json
      let { userId } = ctx.req.user
      if (json?.id) {
        let imgId = json.id
        let image = await imageService.getImageById(imgId)

        if (!image) {
          throw new HttpError("no such a image", 404)
        }

        // delete from db
        let result = imageService.deleteImage(image.id as number)
        if (!result) {
          throw new Error('unable to delete image, id=' + imgId)
        }

        // remove from local disk
        try {
          await Deno.remove(image.local_path)

          ctx.send({
            success: true, message: `successful delete file: ${image.filename}, id=${image.id}`,
            data: {
              image: { ...image, local_path: undefined }
            }
          })
        } catch (e) {
          ctx.status(400).send({
            success: false,
            message: `cannot find file: ${image.filename}, id=${image.id}`,
            data: {
              image: { ...image, local_path: undefined }
            }
          })
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