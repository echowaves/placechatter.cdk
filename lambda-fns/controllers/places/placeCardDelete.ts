const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import placeCardRead from './placeCardRead'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,

  cardUuid: string,
) {
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  const { card, photo } = await placeCardRead(placeUuid, cardUuid)

  if (photo) {
    throw 'Delete Card Photo first.'
  }

  await psql.connect()

  await psql.query(
    `
                    DELETE from "PlacesCards"                    
                    WHERE
                      "placeUuid" = $1
                    AND
                      "cardUuid" = $2
                    returning *
                    `,
    [placeUuid, cardUuid],
  )

  await psql.query(
    `
                    UPDATE "Places"
                    SET
                      "updatedAt" = $1
                      
                    WHERE
                      "placeUuid" = $2
                    returning *
                    `,
    [updatedAt, placeUuid],
  )
  await psql.clean()

  // console.log({ r1, r2 })
  // return { uploadUrl, photo: plainToClass(Photo, photo) }
  return true
}
