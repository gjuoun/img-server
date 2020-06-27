import { bcrypt } from '../deps.ts'
import { config } from '../config/config.ts'
import userModel, { User, UserModel } from '../models/user.ts'
import imageModel, { Image, ImageModel } from '../models/image.ts'

export class UserService {
  private userModel: UserModel
  private imageModel: ImageModel
  private usernameRegexp: RegExp
  private passwordRegexp: RegExp

  constructor(
    userModel: UserModel, imageModel: ImageModel,
    usernameRegexp: RegExp, passwordRegexp: RegExp) {
    this.userModel = userModel
    this.imageModel = imageModel
    this.usernameRegexp = usernameRegexp
    this.passwordRegexp = passwordRegexp
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
      return { valid: false, message: "username is invalid" }
    } else if (!password.match(this.passwordRegexp)) {
      return { valid: false, message: "password is invalid" }
    } else {
      return { valid: true }
    }
  }

  isValidPassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword)
  }
}

export default new UserService(
  userModel, imageModel,
  config.user_usernameRegexp, config.user_passwordRegexp
)

