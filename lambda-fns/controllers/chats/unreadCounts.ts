const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)

  await psql.connect()

  const unreadCounts = (
    await psql.query(
      `
          SELECT "ChatsPhones".*, "PlacesChats"."chatName",  "PlacesChats"."placeUuid"
          FROM "ChatsPhones" 
          INNER JOIN "PlacesChats" ON "ChatsPhones"."chatUuid" = "PlacesChats"."chatUuid"
          WHERE 
            "ChatsPhones"."phoneNumber" = $1                    
      `,
      [phoneNumber],
    )
  ).rows

  await psql.clean()

  return unreadCounts
}
