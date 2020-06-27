import {bcrypt} from '../deps.ts'

import userModel, { User, UserModel } from '../models/User.ts'
import imageModel, { Image, ImageModel } from '../models/image.ts'

export class UserService {
  private userModel: UserModel
  private imageModel: ImageModel
  private usernameRegexp = /\w{5,30}/
  private passwordRegexp = /.{8,64}/

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

  isValidUser(username: string, password: string) {
    if (!username.match(this.usernameRegexp)) {
      return { valid: false, message: "username must be letter or numbers, with length of 5 to 30" }
    } else if (!password.match(this.passwordRegexp)) {
      return { valid: false, message: "password must have a length of 8,64" }
    } else {
      return { valid: true }
    }
  }

  isValidPassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword)
  }
}

export default new UserService(userModel, imageModel)

