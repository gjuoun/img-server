import { Application } from '../deps.ts'
import deligeniusLoader from './deligenius.ts'

export async function init({ app }: { app: Application<any> }) {
  await deligeniusLoader({ app })
  console.log("Deligenius App Initialized")

}