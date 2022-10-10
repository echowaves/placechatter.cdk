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
  console.log({ place })

  const dbPhotos = (
    await psql.query(`
    SELECT
    p.*, pp."placeUuid"
    FROM "Photos" p
    INNER JOIN "PlacesPhotos" pp
    ON p."photoUuid" = pp."photoUuid"
    WHERE pp."placeUuid" = '${placeUuid}'
    ORDER BY pp."updatedAt" DESC
  `)
  ).rows

  // const placeRole = (
  //   await psql.query(`
  // SELECT * from "PlacesPhones"
  //                   WHERE
  //                   "placeUuid" = '${placeUuid}'
  //                   `)
  // ).rows[0]

  await psql.clean()

  return {
    place,
    photos: [
      ...dbPhotos
        // .filter((photo: any) => place.placeUuid === photo.placeUuid)
        .map((photo: any) => {
          return plainToClass(Photo, photo)
        }),
    ],
  }
}
