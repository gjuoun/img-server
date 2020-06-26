
import { Application, HttpError, mid } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import { config } from '../config/config.ts'

import { auth } from '../api/auth.ts'
import { uploadImg } from '../api/upload.ts'
import { deleteImg } from '../api/delete.ts'

export default async function ({ app }: { app: Application<any> }) {
  /* -------------------------------------------------------------------------- */
  /*                             SERVER STATIC FILES                            */
  /* -------------------------------------------------------------------------- */

  // serve static files
  app.use(
    mid.serveStatic(config.staticRoot),
    (ctx, next) => {
      // redirect home page as needed
      if (ctx.req.url === "/") {
        ctx.res.headers.set("Location", "/index.html")
        ctx.status(307).send("")
      } else {
        next()
      }
    }
  );


  /* -------------------------------------------------------------------------- */
  /*                                AUTHORIZATION                               */
  /* -------------------------------------------------------------------------- */

  // authorization
  app.use(auth());

  /* -------------------------------------------------------------------------- */
  /*                                API ENDPOINTS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * POST /upload
   * handle file upload - authorized user can upload files
   */
  app.use(uploadImg())

  /**
   * DELETE /delete
   * handle file delete - authorized user can delete their own files
   */
  app.use(deleteImg())


/* -------------------------------------------------------------------------- */
/*                                SERVE IMAGES                                */
/* -------------------------------------------------------------------------- */

  // serve img files - authorized user can only access their own images
  app.use(
    (ctx, next) => {
      if (ctx.req.url.startsWith(`/${ctx.req.user}`) && ctx.req.method === METHOD.GET) {
        next()
      } else {
        throw new HttpError("unauthorized access", 403)
      }
    },
    mid.serveStatic(config.imgRoot)
  );


  /* -------------------------------------------------------------------------- */
  /*                                ERROR HANDLER                               */
  /* -------------------------------------------------------------------------- */

  // No image or route found, return 404
  app.use((ctx, next) => {
    ctx.status(404).send("")
  })

  // override error handler
  app.handleError = (err, ctx) => {
    if (err instanceof HttpError) {
      ctx.status(err.status).send({ success: false, message: err.message })
    } else {
      ctx.status(404).send("")
    }
  }

  return app
}
