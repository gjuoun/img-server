import { mysql } from '../db/db.ts'

export interface User {
  id?: number,
  username: string,
  password: string
}

export class UserModel {
  // TODO: encrypt user password
  async insertUser(user: User): Promise<{ id: number } | undefined> {
    try {
      let query = `INSERT INTO user(username, password) values(?, ?)`
      let result = await mysql.execute(query, [user.username, user.password])
      if (result) {
        return { id: result.lastInsertId as number }
      } else {
        throw new Error("insert user failed, username" + user.username)
      }
    }
    catch (e) {
      console.warn(e.message)
      return undefined
    }
  }

  async updateUser(user: User): Promise<User | undefined> {
    try {
      let query = `UPDATE user SET username=?, password=? WHERE id=?;`
      let result = await mysql.execute(query, [user.username, user.password, user.id])
      if (result?.affectedRows) {
        return user
      } else {
        throw new Error("update user failed, id=" + user.id)
      }
    }
    catch (e) {
      console.log(e.message)
      return undefined
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    try {
      let result: User[] = await mysql.query("SELECT * FROM user WHERE id = ? ", [id])
      if (result.length > 0) {
        return result[0]
      } else {
        throw new Error("no user found: id=" + id)
      }
    } catch (e) {
      console.warn(e.message)
      return undefined
    }

  }

  async getUserUsername(username: string): Promise<User | undefined> {
    try {
      let result: User[] = await mysql.query("SELECT * FROM user WHERE username = ? ", [username])
      if (result.length > 0) {
        return result[0]
      } else {
        throw new Error("no user found: username=" + username)
      }
    } catch (e) {
      console.warn(e.message)
      return undefined
    }

  }
}


export default new UserModel()
