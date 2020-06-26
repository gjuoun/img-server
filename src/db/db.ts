import { Client } from "https://deno.land/x/mysql/mod.ts";
import { config } from '../config/config.ts'


export const mysql = await new Client().connect({
  hostname: config.mysql_hostname,
  username: config.mysql_username,
  db: config.mysql_dbname,
  password: config.mysql_password,
  poolSize: 3
});

console.log("MySQL Initialized")

