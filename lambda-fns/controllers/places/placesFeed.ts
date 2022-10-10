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
    LIMIT 1000
    OFFSET 0
  `)
  ).rows

  // console.log({ dbPlaces })

  const dbPhotos = (
    await psql.query(`
    SELECT
    p.*, pp."placeUuid"
    FROM "Photos" p
    INNER JOIN "PlacesPhotos" pp
    ON p."photoUuid" = pp."photoUuid"
    WHERE pp."placeUuid" in (${dbPlaces
      .map((place: any) => {
        return `'${place.placeUuid}'`
      })
      .toString()})
    ORDER BY pp."updatedAt" DESC
  `)
  ).rows

  // console.log({ dbPhotos })

  await psql.clean()

  // const places = results.map((photo: any) => plainToClass(Photo, photo))
  const places = dbPlaces.map((place: any) => {
    return {
      place,
      photos: [
        ...dbPhotos
          .filter((photo: any) => place.placeUuid === photo.placeUuid)
          .map((photo: any) => {
            return plainToClass(Photo, photo)
          }),
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
