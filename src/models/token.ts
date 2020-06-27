import { mysql } from '../db/db.ts'

export interface Token {
  id?: number,
  user_id: number,
  refresh_token: string
}

export class TokenModel {

  async insertToken(token: Token): Promise<{ id: number } | undefined> {
    try {
      let query = `INSERT INTO token(user_id, refresh_token) values(?, ?)`
      let result = await mysql.execute(query, [token.user_id, token.refresh_token])
      if (result) {
        return { id: result.lastInsertId as number }
      } else {
        throw new Error("insert new token failed, user_id=" + token.user_id)
      }
    }
    catch (e) {
      console.warn(e.message)
      return undefined
    }
  }

  async updateToken(token: Token): Promise<Token | undefined> {
    try {
      let query = `UPDATE token SET refresh_token=? WHERE id=?;`
      let result = await mysql.execute(query, [token.refresh_token, token.id])
      if (result?.affectedRows) {
        return token
      } else {
        throw new Error("update token failed, id=" + token.id)
      }
    }
    catch (e) {
      console.log(e.message)
      return undefined
    }
  }

  async getTokenById(id: number): Promise<Token | undefined> {
    try {
      let result: Token[] = await mysql.query("SELECT * FROM token WHERE id = ? ", [id])
      if (result.length > 0) {
        return result[0]
      } else {
        throw new Error("no token found: id=" + id)
      }
    } catch (e) {
      console.warn(e.message)
      return undefined
    }

  }

  async getTokenByUserId(userId: number): Promise<Token | undefined> {
    try {
      let result: Token[] = await mysql.query("SELECT * FROM token WHERE user_id = ? ", [userId])
      if (result.length > 0) {
        return result[0]
      } else {
        throw new Error("no token found: user_id=" + userId)
      }
    } catch (e) {
      console.warn(e.message)
      return undefined
    }

  }
}

export default new TokenModel()