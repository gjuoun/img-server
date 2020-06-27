import { Context, HttpError } from "../../deps.ts";
import { METHOD } from '../../types/types.ts'
import imageService from '../../services/image.ts'


export function allImages() {
  return async (ctx: Context<any>, next: Function) => {
    if (
      ctx.req.url === "/api/img/all" &&
      ctx.req.method === METHOD.GET) {
      let { userId } = ctx.req.user

      const images = await imageService.getImagesByUserId(userId)
      if (images) {
        // never expose localPath outside of server
        let newImages = images.map((image) => {
          return {
            id: image.id,
            user_id: image.user_id,
            filename: image.filename,
          }
        })

        ctx.send({ success: true, data: { images: newImages } })
      } else {
        throw new HttpError("no images found", 404)
      }
    }
    else {
      next()
    }
  }
}