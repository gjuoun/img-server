import { Client } from "https://deno.land/x/mysql/mod.ts";
import { config } from '../config/config.ts'


export const mysql = await new Client().connect({
  hostname: config.mysql_hostname,
  port: config.mysql_port,
  username: config.mysql_username,
  db: config.mysql_dbname,
  password: config.mysql_password,
  poolSize: config.mysql_poolSize,
});

console.log("MySQL Initialized")

