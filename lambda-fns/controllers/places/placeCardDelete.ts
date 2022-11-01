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
  // await VALID.isValidToken(uuid, phoneNumber, token)
  await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid)

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  const { card, photo } = await placeCardRead(placeUuid, cardUuid)

  if (photo) {
    throw 'Delete Card Photo first.'
  }

  await psql.connect()

  await psql.query(`
                    DELETE from "PlacesCards"                    
                    WHERE
                      "placeUuid" = '${placeUuid}'
                    AND
                      "cardUuid" = '${cardUuid}'
                    returning *
                    `)

  await psql.query(`
                    UPDATE "Places"
                    SET
                      "updatedAt" = '${updatedAt}'
                      
                    WHERE
                      "placeUuid" = '${placeUuid}'
                    returning *
                    `)
  await psql.clean()

  // console.log({ r1, r2 })
  // return { uploadUrl, photo: plainToClass(Photo, photo) }
  return true
}
