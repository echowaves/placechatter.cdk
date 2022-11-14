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
  cardUuid: string,
) {
  VALID.uuid(placeUuid)
  VALID.uuid(cardUuid)

  await psql.connect()

  const card = (
    await psql.query(
      `
                    SELECT * from "PlacesCards"
                    WHERE
                      "cardUuid" = $1
                    AND
                      "placeUuid" = $2
                    ORDER BY "sortOrder"
                    `,
      [cardUuid, placeUuid],
    )
  ).rows[0]

  if (!card) {
    return null
  }

  // console.log({ place })
  if (!card?.photoUuid) {
    return {
      ...card,
    }
  }

  const photo = (
    await psql.query(
      `
      SELECT * from "Photos"
      WHERE "photoUuid" = $1
      AND "active" = $2
      `,
      [card.photoUuid, true],
    )
  ).rows[0]

  // console.log({ cardsPhotos })
  await psql.clean()

  return {
    ...card,
    photo: plainToClass(Photo, photo),
  }
}
