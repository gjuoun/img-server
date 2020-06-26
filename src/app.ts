import { Application, HttpError, mid } from "./deps.ts";
import { config } from "./config/config.ts";
import { init } from './loaders/loaders.ts'

async function startApp() {
  const app = new Application({ port: config.port })
  await init({ app })

  app.listen();
  console.log(`Server is running at ${config.port}`);
}

startApp()