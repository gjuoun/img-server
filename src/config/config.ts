export const config = {
  app_port: 8000,
  app_maxFileSize: 20 << 20, // 20Mb
  app_imgRoot: "./img",
  app_imgField: "multiple",
  app_staticRoot: "./public",

  user_usernameRegexp: /\w{5,30}/,
  user_passwordRegexp: /.{8,64}/,

  jwt_key: "mysecret",

  mysql_hostname: 'localhost',
  mysql_port: 3306,
  mysql_username: 'johngg',
  mysql_password: '21346687',
  mysql_dbname: 'test',
  mysql_poolSize: 20
}
