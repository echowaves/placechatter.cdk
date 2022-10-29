var AWS = require('aws-sdk')

import psql from '../../psql'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

import { VALID } from '../../valid'
import * as UTILS from '../../utils'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(lat: number, lon: number) {
  await psql.connect()

  const dbPlaces = (
    await psql.query(`
    SELECT
    *
    , 
    ST_Distance(ST_SetSRID(ST_MakePoint(${lon}, ${lat} ), 4326)::geography, "location"::geography) 
      as "distance"
    FROM "Places"
    ORDER BY "distance"
    LIMIT 100
    OFFSET 0
  `)
  ).rows

  // console.log({ dbPlaces })

  let dbPlacesCards: any = []

  // console.log({
  //   placeUuids: dbPlaces
  //     .map((place: any) => {
  //       return `'${place.placeUuid}'`
  //     })
  //     .toString(),
  // })

  if (dbPlaces.length > 0) {
    dbPlacesCards = (
      await psql.query(`
    SELECT
    * 
    FROM "PlacesCards" 
    WHERE "placeUuid" in (${dbPlaces
      .map((place: any) => {
        return `'${place.placeUuid}'`
      })
      .toString()})
    AND "active" = true
    ORDER BY "sortOrder" 
  `)
    ).rows
  }

  // console.log({ placesCards: dbPlacesCards })

  const photosUuids = dbPlacesCards
    .filter((card: any) => card.photoUuid) // remove all cards that don't have photos
    .map((card: any) => {
      return card.photoUuid
    })

  // console.log({ photosUuids })

  let dbCardsPhotos: any = []

  if (photosUuids.length > 0) {
    dbCardsPhotos = (
      await psql.query(`
        SELECT *
        FROM "Photos"
        WHERE "photoUuid" IN (
          ${dbPlacesCards
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
  // console.log({ cardsPhotos: dbCardsPhotos })
  await psql.clean()

  // const places = results.map((photo: any) => plainToClass(Photo, photo))
  const places = dbPlaces.map((place: any) => {
    return {
      place,
      cards: [
        ...dbPlacesCards
          .filter((placeCard: any) => placeCard.placeUuid === place.placeUuid)
          .map((card: any) => {
            if (card.photoUuid) {
              // if photo exists, add to card
              return {
                ...card,
                photo: plainToClass(
                  Photo,
                  dbCardsPhotos.find(
                    (photo: any) => photo.photoUuid === card.photoUuid,
                  ),
                ),
              }
            }
            return card
          }),
      ],
    }
  })

  // console.log({ places: JSON.stringify(places) })

  return {
    places,
    // batch,
    // noMoreData,
  }
}
