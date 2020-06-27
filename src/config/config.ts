import { config as dotenv } from "https://deno.land/x/dotenv/mod.ts";

let env
if (
  Deno.env.get("DENO_ENV") &&
  Deno.env.get("DENO_ENV") === 'production') {
  env = Deno.env.toObject()
} else {
  // load .env
  env = dotenv() as Record<string, string>
}

console.log(env)

export const config = {
  app_port: toNumber(env["APP_PORT"]) || 8000,
  // default maxFileSize: 20Mb in bytes
  app_maxFileSize:
    toNumber(env["APP_MAXFILESIZE"]) || 20 << 20,
  app_imgRoot: env["APP_IMGROOT"] || "./img",
  app_imgField: env["APP_IMGFIELD"] || "multiple",
  app_staticRoot: env["APP_STATICROOT"] || "./public",

  user_usernameRegexp: /\w{5,30}/,
  user_passwordRegexp: /.{8,64}/,

  jwt_key: env["JWT_KEY"] || "mysecret",

  mysql_hostname: env["MYSQL_HOSTNAME"] || 'localhost',
  mysql_port: toNumber(env["MYSQL_PORT"]) || 3306,
  mysql_username: env["MYSQL_USER"] || 'dbuser',
  mysql_password: env["MYSQL_PASSWORD"] || 'dbpassword',
  mysql_dbname: env["MYSQL_DATABASE"] || 'test',
  mysql_poolSize: toNumber(env["MYSQL_POOLSIZE"]) || 10
}

function toNumber(str: string | number | undefined): number | undefined {
  if (typeof str === "number") {
    return str
  } else if (typeof str === 'string') {
    return parseInt(str)
  }
  return undefined
}
