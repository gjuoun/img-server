import userModel, { User, UserModel } from '../models/user.ts'
import imageModel, { Image, ImageModel } from '../models/image.ts'

export class ImageService {
  private userModel: UserModel
  private imageModel: ImageModel

  constructor(userModel: UserModel, imageModel: ImageModel) {
    this.userModel = userModel
    this.imageModel = imageModel
  }

  async getImageById(id: number) {
    return this.imageModel.getImageById(id)
  }

  async getImagesByUserId(userId: number) {
    return this.imageModel.getImagesByUserId(userId)
  }

  async getImageByFilename(userId: number, filename:string) {
    return this.imageModel.getImageByFilename(userId, filename)
  }

  async insertImage(image: Image) {
    return this.imageModel.insertImage(image)
  }

  async insertManyImages(images: Image[]) {
    return this.imageModel.insertManyImages(images)
  }

  async updateImage(image: Image) {
    return this.imageModel.updateImage(image)
  }

  async deleteImage(id: number) {
    return this.imageModel.deleteImage(id)
  }
}

export default new ImageService(userModel, imageModel)

