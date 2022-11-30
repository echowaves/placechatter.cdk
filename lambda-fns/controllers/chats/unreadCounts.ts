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
          FROM "ChatsPhones" 
          WHERE "phoneNumber" = $1
          AND "optIn" = $2
      `,
      [phoneNumber, true],
    )
  ).rows

  await psql.clean()

  return unreadCounts
}
