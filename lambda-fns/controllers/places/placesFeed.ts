var AWS = require('aws-sdk')

import psql from '../../psql'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

import { VALID } from '../../valid'

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
  let placeCards: any = []

  if (dbPlaces.length > 0) {
    placeCards = (
      await psql.query(`
    SELECT
    pc.* 
    FROM "PlacesCards" pc
    INNER JOIN "Places" p
    ON pc."placeUuid" = p."placeUuid" 
    WHERE pc."placeUuid" in (${dbPlaces
      .map((place: any) => {
        return `'${place.placeUuid}'`
      })
      .toString()})
    AND pc."active" = true
    ORDER BY pc."updatedAt" DESC
  `)
    ).rows
  }
  // console.log({ dbPhotos })

  await psql.clean()

  // const places = results.map((photo: any) => plainToClass(Photo, photo))
  const places = dbPlaces.map((place: any) => {
    return {
      place,
      cards: [
        ...placeCards,
        // .filter((card: any) => place.placeUuid === card.placeUuid)
        // .map((card: any) => {
        //   return plainToClass(Photo, photo)
        // }),
      ],
    }
  })

  // console.log({ places: JSON.stringify(places) })
  // return plainToClass(Photo, photo)
  return {
    places,
    // batch,
    // noMoreData,
  }
}
