const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  chatUuid: string,
  lastLoaded: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(chatUuid)
  VALID.dateTime(lastLoaded)

  const limit = 20

  await psql.connect()

  const messages = (
    await psql.query(
      `
  SELECT cm.*, ph."nickName"
      FROM "ChatsMessages" cm
      INNER JOIN "Phones" ph ON cm."createdBy" = ph."phoneNumber"
      WHERE 
        "chatUuid" = $1
      AND
        "createdAt" < $2
      ORDER BY "createdAt" DESC
      LIMIT $3
      `,
      [chatUuid, lastLoaded, limit],
    )
  ).rows

  await psql.clean()

  return messages
}
