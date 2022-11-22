const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  chatUuid: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(chatUuid)

  const limit = 20

  await psql.connect()

  const count = (
    await psql.query(
      `
  SELECT count(*)
      FROM "ChatsPhones"
      WHERE 
        "chatUuid" = $1
      AND
        "phoneNumber" = $2      
      `,
      [chatUuid, phoneNumber],
    )
  ).rows[0].count

  await psql.clean()

  return count === 1 ? true : false
}
