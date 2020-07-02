
import { Application, HttpError, mid } from "../deps.ts";
import { METHOD } from '../types/types.ts'
import { config } from '../config/config.ts'

import { auth } from '../api/auth/auth.ts'
import { login } from '../api/auth/login.ts'
import { token } from '../api/auth/token.ts'
import { register } from '../api/auth/register.ts'

import { uploadImg } from '../api/img/upload.ts'
import { deleteImg } from '../api/img/delete.ts'
import { allImages } from "../api/img/all.ts";

export default async function ({ app }: { app: Application<any> }) {
  /* -------------------------------------------------------------------------- */
  /*                             SERVER STATIC FILES                            */
  /* -------------------------------------------------------------------------- */

  // serve static files
  // app.use(
  //   mid.serveStatic(config.app_staticRoot),
  //   (ctx, next) => {
  //     // redirect home page as needed
  //     if (ctx.req.url === "/") {
  //       ctx.res.headers.set("Location", "/index.html")
  //       ctx.status(307).send("")
  //     } else {
  //       next()
  //     }
  //   }
  // );

  /* -------------------------------------------------------------------------- */
  /*                                 MIDDLEWARES                                */
  /* -------------------------------------------------------------------------- */

  app.use(mid.json())

  /* -------------------------------------------------------------------------- */
  /*                                API ENDPOINTS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * POST /api/auth/login
   * allow user to login and assign jwt tokens
   */
  app.use(login())

  /**
   * POST /api/auth/token
   * allow user to get token by a refreshToken
   */
  app.use(token())

  /**
   * POST /api/auth/register
   * allow user to login and assign jwt tokens
   */
  app.use(register())

  /**
   * Read Authorization header
   * then populates ctx.req.user = {userId: number}
   */
  app.use(auth());

  /**
   * GET /api/img/all
   * return image information in json format
   * - authorized user can only get their own images
   */
  app.use(allImages())
  /**
   * POST /api/img/upload
   * handle file upload 
   * - authorized user can upload files
   */
  app.use(uploadImg(config.app_imgField))

  /**
   * DELETE /api/img/delete
   * handle file delete 
   * - authorized user can delete their own files
   */
  app.use(deleteImg())


  /* -------------------------------------------------------------------------- */
  /*                                SERVE IMAGES                                */
  /* -------------------------------------------------------------------------- */

  // serve img files - authorized user can only access their own images
  app.use(
    async (ctx, next) => {
      let url = ctx.req.url
      let { userId } = ctx.req.user

      if (url.startsWith(`/${userId}`) && ctx.req.method === METHOD.GET) {
        next()
      } else {
        throw new HttpError("unauthorized access", 403)
      }
    },
    mid.serveStatic(config.app_imgRoot)
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
