import { mysql } from '../db/db.ts'

export interface Image {
  id?: number,
  user_id: number,
  filename: string,
  local_path: string
}

export default class {
  async insertImage(image: Image) {
    try {
      let query = `INSERT into image (user_id , filename , local_path ) values(?, ?, ?);`
      let result = await mysql.execute(query, [image.user_id, image.filename, image.local_path])
      return { id: result.lastInsertId }
    }
    catch (e) {
      return undefined
    }
  }

  async insertManyImages(images: Image[]) {
    try {
      let query = `INSERT into image (user_id , filename , local_path ) values(?, ?, ?);`
      let results = []
      for (let image of images) {
        let result = await mysql.execute(query, [image.user_id, image.filename, image.local_path])
        results.push(result)
      }
      return results.map((result) => ({ id: result.lastInsertId }))
    }
    catch (e) {
      return undefined
    }
  }

  async getImageById(id: number) {
    try {
      let result: Image[] = await mysql.query("SELECT * FROM image WHERE id = ? ", [id])
      return result[0]
    } catch (e) {
      return undefined
    }

  }
}