import { validateJwt, makeJwt, setExpiration, Jose, Payload } from '../deps.ts'
import { config } from '../config/config.ts'

export interface AppPayload extends Payload {
  userId: number
}

export class JwtService {
  jwtKey: string
  header: Jose

  constructor(jwtKey: string) {
    this.jwtKey = jwtKey
    this.header = {
      alg: "HS256"
    }
  }

  generateJwt(payload: AppPayload): string {
    return makeJwt({
      key: this.jwtKey,
      header: this.header,
      payload
    })
  }

  async validateJwt(token: string): Promise<AppPayload | undefined> {
    let result = await validateJwt(token, this.jwtKey)
    if (result.isValid) {
      return result.payload as AppPayload
    } else {
      return undefined
    }
  }

}


export default new JwtService(config.jwt_key)