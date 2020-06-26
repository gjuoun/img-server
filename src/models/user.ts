import { mysql } from '../db/db.ts'

export interface User {
  id: string,
  username: string,
  password: string
}

export default class {
  async insertUser(user: User) {
    try {
      let query = `INSERT INTO user(username, password) values(?, ?)`
      let result = await mysql.execute(query, [user.username, user.password])
      return { id: result.lastInsertId }
    }
    catch (e) {
      return undefined
    }
  }

  async getUserById(id: number) {
    try {
      let result: User[] = await mysql.query("SELECT * FROM user WHERE id = ? ", [id])
      return result[0]
    } catch (e) {
      return undefined
    }

  }
}