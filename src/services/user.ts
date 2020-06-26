import userModel, { User, UserModel } from '../models/User.ts'
import imageModel, { Image, ImageModel } from '../models/image.ts'

export class UserService {
  private userModel: UserModel
  private imageModel: ImageModel

  constructor(userModel: UserModel, imageModel: ImageModel) {
    this.userModel = userModel
    this.imageModel = imageModel
  }

  async getUserById(id: number) {
    return this.userModel.getUserById(id)
  }

  async getUserByUsername(username: string) {
    return this.userModel.getUserUsername(username)
  }

  async insertUser(user: User) {
    return this.userModel.insertUser(user)
  }

  async updateUser(user: User) {
    return this.userModel.updateUser(user)
  }

  //TODO; use regexp validate username and password 
  isValidUser(username: string, password: string) {

  }

  // TODO: use bcrypt to verify password
  isValidPassword(password: string, hashedPassword: string) {

  }
}

export default new UserService(userModel, imageModel)

