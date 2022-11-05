const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,
) {
  // await VALID.isValidToken(uuid, phoneNumber, token)
  await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid)

  await psql.connect()

  const count = (
    await psql.query(
      `
      SELECT COUNT(*)
              FROM "PlacesCards"
              WHERE 
                  "placeUuid" = $1
    `,
      [placeUuid],
    )
  )?.rows[0]?.count // should never throw

  await psql.clean()
  // console.log({ count })
  if (count !== '0') {
    throw 'Delete All Cards first'
  }

  await psql.connect()

  await psql.query(
    `
                    DELETE from "PlacesPhones"
                    WHERE
                      "placeUuid" = $1
                    returning *
                    `,
    [placeUuid],
  )
  await psql.query(
    `
                    DELETE from "Places"
                    WHERE
                      "placeUuid" = $1
                    returning *
                    `,
    [placeUuid],
  )
  // ).rows[0]

  await psql.clean()

  return true
}
