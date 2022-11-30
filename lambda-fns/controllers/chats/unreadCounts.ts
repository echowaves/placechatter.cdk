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
          SELECT
            cp.*,
            COUNT(CASE WHEN cm."createdAt" > cp."lastReadAt" THEN 1 END) AS "unread"
          FROM "ChatsPhones" cp
            INNER JOIN "ChatsMessages" cm ON cp."chatUuid" = cm."chatUuid"
          WHERE cp."phoneNumber" = $1
          GROUP BY cp."chatUuid", cp."updatedAt"
      `,
      [phoneNumber],
    )
  ).rows

  await psql.clean()

  return unreadCounts
}
