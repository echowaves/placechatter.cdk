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
                    `,
      [placeUuid],
    )
  ).rows

  await psql.clean()

  return placeChats
}
