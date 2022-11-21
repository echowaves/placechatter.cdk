const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(placeUuid)

  await psql.connect()

  const placeChats = (
    await psql.query(
      `
                    SELECT * FROM "PlacesChats"
                    WHERE
                      "placeUuid" = $1 
                    AND
                      "defaultChat" = $2
                    `,
      [placeUuid, true],
    )
  ).rows

  await psql.clean()

  if (placeChats.length === 0) {
    return null
  }
  return placeChats[0]
}
