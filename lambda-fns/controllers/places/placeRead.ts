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

  const placeCards = (
    await psql.query(`
    SELECT
    pc.*
    FROM "PlacesCards" pc
    INNER JOIN "Places" p
    ON pc."placeUuid" = p."placeUuid"
    WHERE pc."placeUuid" = '${placeUuid}'    
    ORDER BY pc."updatedAt" DESC
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
    cards: [
      ...placeCards,
      // .filter((photo: any) => place.placeUuid === photo.placeUuid)
      // .map((photo: any) => {
      //   return plainToClass(Photo, photo)
      // }),
    ],
  }
}
