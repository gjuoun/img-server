import { mysql } from '../db/db.ts'

export interface Image {
  id?: number,
  user_id: number,
  filename: string,
  local_path: string
}

export class ImageModel {
  async insertImage(image: Image): Promise<{ id: number } | undefined> {
    try {
      let query = `INSERT into image (user_id , filename , local_path ) values(?, ?, ?);`
      let result = await mysql.execute(query, [image.user_id, image.filename, image.local_path])
      if (result) {
        return { id: result.lastInsertId as number }
      } else {
        throw new Error("insert image failed, image:" + image.filename)
      }
    }
    catch (e) {
      return undefined
    }
  }

  async insertManyImages(images: Image[]): Promise<{ id: number }[] | undefined> {
    try {
      let query = `INSERT into image (user_id , filename , local_path ) values`
      let values = `(?, ?, ?),`
      let queryParams: any = []
      for (let image of images) {
        query += values
        let params = [image.user_id, image.filename, image.local_path]
        queryParams = [...queryParams, ...params]
      }
      // replace last comma to semi-colon
      query = query.replace(/\,$/, ";")

      let result = await mysql.execute(query, queryParams)
      if (result && result.affectedRows === images.length) {
        let results = []
        // calculate insert ids
        for (let i = 0; i < result.affectedRows; i++) {
          results.push({ id: <number>result.lastInsertId + i })
        }
        return results.reverse()
      } else {
        throw new Error("insert multiple image failed")
      }
    }
    catch (e) {
      return undefined
    }
  }

  async updateImage(image: Image): Promise<Image | undefined> {
    try {
      let query = `UPDATE image SET user_id=?, filename=?, local_path=? WHERE id=?`
      let result = await mysql.execute(query, [image.user_id, image.filename, image.local_path, image.id])
      if (result?.affectedRows) {
        return image
      } else {
        throw new Error("update image failed, id=" + image.id)
      }
    }
    catch (e) {
      console.log(e.message)
      return undefined
    }
  }


  async deleteImage(id: number): Promise<{ id: number } | undefined> {
    try {
      let query = `DELETE FROM image WHERE id=?`
      let result = await mysql.execute(query, [id])
      if (result?.affectedRows === 1) {
        return { id }
      } else {
        throw new Error("delete image failed, id:" + id)
      }
    } catch (e) {
      console.log(e.message)
      return undefined
    }
  }

  async getImageById(id: number): Promise<Image | undefined> {
    try {
      let result: Image[] = await mysql.query("SELECT * FROM image WHERE id = ? ", [id])
      if (result?.length > 0) {
        return result[0]
      } else {
        throw new Error("no image found, id=" + id)
      }
    } catch (e) {
      console.log(e.message)
      return undefined
    }
  }

  async getImagesByUserId(userId: number): Promise<Image[] | undefined> {
    try {
      let result: Image[] = await mysql.query("SELECT * FROM image WHERE user_id = ? ", [userId])
      if (result?.length > 0) {
        return result
      } else {
        throw new Error("no image found, user_id=" + userId)
      }
    } catch (e) {
      console.log(e.message)
      return undefined
    }
  }

  async getImageByFilename(userId: number, filename: string): Promise<Image | undefined> {
    try {
      let result: Image[] = await mysql.query("SELECT * FROM image WHERE user_id = ? AND filename=?;", [userId, filename])
      if (result?.length > 0) {
        return result[0]
      } else {
        throw new Error("no image found, user_id=" + userId + ", filename=" + filename)
      }
    } catch (e) {
      console.log(e.message)
      return undefined
    }
  }
}

export default new ImageModel()