import { User } from '../models/User.ts'
import { mysql } from '../loaders/mysql.ts'

async function insertUser(username: string, password: string) {
  try {
    let result = await mysql.execute("INSERT INTO user(username, password) values(?, ?)", [username, password])
    return { id: result.lastInsertId }
  }
  catch (e) {
    return undefined
  }
}

async function getUserById(id: number) {
  try {
    let result: User[] = await mysql.query("SELECT * FROM user WHERE id = ? ", [id])
    return result[0]
  } catch (e) {
    return undefined
  }
}