
import { Application, HttpError, mid } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import { config } from '../config/config.ts'

import { auth } from '../api/auth.ts'
import { login } from '../api/login.ts'
import { token } from '../api/token.ts'
import { register } from '../api/register.ts'
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
  /*                                 MIDDLEWARES                                */
  /* -------------------------------------------------------------------------- */

  app.use(mid.json())

  /* -------------------------------------------------------------------------- */
  /*                                API ENDPOINTS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * POST /api/login
   * allow user to login and assign jwt tokens
   */
  app.use(login())

  /**
   * POST /api/token
   * allow user to login and assign jwt tokens
   */
  app.use(token())

  /**
   * POST /api/register
   * allow user to login and assign jwt tokens
   */
  app.use(register())

  // authorization
  app.use(auth());

  /**
   * POST /api/upload
   * handle file upload - authorized user can upload files
   * @param: fieldName: string
   */
  app.use(uploadImg("multiple"))

  /**
   * DELETE /api/delete
   * handle file delete - authorized user can delete their own files
   */
  app.use(deleteImg())


  /* -------------------------------------------------------------------------- */
  /*                                SERVE IMAGES                                */
  /* -------------------------------------------------------------------------- */

  // serve img files - authorized user can only access their own images
  app.use(
    (ctx, next) => {
      let url = ctx.req.url
      let user = ctx.req.user

      if (url.startsWith(`/${user}`) && ctx.req.method === METHOD.GET) {
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
