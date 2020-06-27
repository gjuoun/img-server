import { bcrypt } from '../deps.ts'
import { config } from '../config/config.ts'
import tokenModel, { Token, TokenModel } from '../models/token.ts'

export class TokenService {
  private tokenModel: TokenModel

  constructor(tokenModel: TokenModel) {
    this.tokenModel = tokenModel
  }

  async getTokenById(id: number) {
    return this.tokenModel.getTokenById(id)
  }

  async getTokenByUserId(id: number) {
    return this.tokenModel.getTokenByUserId(id)
  }

  async insertToken(token: Token) {
    return this.tokenModel.insertToken(token)
  }

  async updateToken(token: Token) {
    return this.tokenModel.updateToken(token)
  }

}

export default new TokenService(tokenModel)

