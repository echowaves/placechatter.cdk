const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(placeUuid)

  await psql.connect()

  let placeChats = (
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

  if (placeChats.length === 0) {
    const chatUuid = uuidv4()
    const createdAt = dayjs().format(VALID.dateFormat) // display

    placeChats = (
      await psql.query(
        `
                      INSERT INTO "PlacesChats"
                      (
                        "placeUuid",
                        "chatUuid",
                        "chatName",
                        "defaultChat",
                        "createdAt"
                    ) values (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5
                    )
                    returning *                    
                      `,
        [placeUuid, chatUuid, 'main chat', true, createdAt],
      )
    ).rows
  }

  await psql.clean()

  return placeChats[0]
}
