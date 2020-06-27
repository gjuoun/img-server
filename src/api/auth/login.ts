import { mid, Context, HttpError } from "../../deps.ts";
import { METHOD } from '../../types/types.ts'
import { User } from '../../models/user.ts'
import userService from '../../services/user.ts'
import jwtService from '../../services/jwt.ts'
import tokenService from '../../services/token.ts'

/**
 * Verify username with password
 * then return user with jwt token and refreshToken
 */

export function login() {
  return async (ctx: Context<any>, next: Function) => {
    if (ctx.req.url === "/api/auth/login" && ctx.req.method === METHOD.POST) {
      let json = ctx.req.json
      if (json.username && json.password) {
        const user = await userService.getUserByUsername(json.username)
        if (!user) {
          throw new HttpError("no user found, username=" + json.username, 400)
        }

        // verify password
        if (!userService.isValidPassword(json.password, user.password)) {
          throw new HttpError("password is wrong, username=" + json.username, 400)
        }

        ctx.send({
          success: true,
          data: {
            user: { ...user, password: undefined },
            token: getToken(user),
            refreshToken: await getRefreshToken(user)
          }
        })

      } else {
        throw new HttpError("no username or password provided", 400)
      }
    } else {
      next()
    }
  }
}

function getToken(user: User) {
  return jwtService.generateJwt({
    userId: user.id as number,
    exp: Date.now() + 30000
  })
}

async function getRefreshToken(user: User) {
  let refreshToken = ""
  let tokenResult = await tokenService.getTokenByUserId(user.id as number)

  if (tokenResult) {
    // token exists, use it
    refreshToken = tokenResult.refresh_token
  } else {
    // token doesn't exist, create it
    refreshToken = jwtService.generateJwt({
      userId: user.id as number,
    })
    let newToken = { user_id: user.id as number, refresh_token: refreshToken }

    await tokenService.insertToken(newToken)
  }

  return refreshToken
}