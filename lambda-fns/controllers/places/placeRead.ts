var AWS = require('aws-sdk')

import psql from '../../psql'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(
  // uuid: string,
  // phoneNumber: string,
  // token: string,

  placeUuid: string,
) {
  await psql.connect()

  const place = (
    await psql.query(`
                    SELECT * from "Places"
                    WHERE
                    "placeUuid" = '${placeUuid}' 
                    `)
  ).rows[0]

  // console.log({ place })

  const placesCards = (
    await psql.query(`
    SELECT
    pc.*
    FROM "PlacesCards" pc
    WHERE pc."placeUuid" = '${placeUuid}'    
    ORDER BY pc."sortOrder" 
  `)
  ).rows
  // console.log({ placesCards })

  const photosUuids = placesCards
    .filter((card: any) => card.photoUuid) // remove all cards that don't have photos
    .map((card: any) => {
      return card.photoUuid
    })
  // .toString()

  // console.log({ photosUuids })
  // console.log({ photosUuidsString: photosUuids.toString() })

  let cardsPhotos: any = []

  if (photosUuids.length > 0) {
    cardsPhotos = (
      await psql.query(`
        SELECT *
        FROM "Photos"
        WHERE "photoUuid" IN (
          ${placesCards
            .filter((card: any) => card.photoUuid) // remove all cards that don't have photos
            .map((card: any) => {
              return `'${card.photoUuid}'`
            })
            .toString()}
        )
        AND "active" = true
      `)
    ).rows
  }
  // console.log({ cardsPhotos })

  await psql.clean()

  const returnValue = {
    place,
    cards: [
      ...placesCards.map((card: any) => {
        if (card.photoUuid) {
          // if photo exists, add to card
          return {
            ...card,
            photo: plainToClass(
              Photo,
              cardsPhotos.find(
                (photo: any) => photo.photoUuid === card.photoUuid,
              ),
            ),
          }
        }
        return card
      }),
    ],
  }
  // console.log({ returnValue: JSON.stringify(returnValue) })
  return returnValue
}
