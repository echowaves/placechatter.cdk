import psql from './psql'
import { plainToClass } from 'class-transformer'

// just a placeholder for future use
export async function enhanceCardsWithPhotos(placesCards: []) {
  await psql.connect()

  await psql.clean()

  return placesCards
}
