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

  // console.log({ lastLoaded })
  await psql.connect()

  const messages = (
    await psql.query(
      `
  SELECT 
    cm.*, 
    COALESCE(ph."nickName", 'anonym') AS "nickName"  

    
  FROM "ChatsMessages" cm
      LEFT JOIN "Phones" ph ON cm."createdBy" = ph."phoneNumber"
      WHERE 
        "chatUuid" = $1
      AND
        cm."createdAt" < $2
      ORDER BY cm."createdAt" DESC
      LIMIT $3
      `,
      [chatUuid, lastLoaded, limit],
    )
  ).rows

  // console.log({ messages })

  await psql.clean()

  return messages
}
