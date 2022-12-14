var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import isSubscribedToChat from './isSubscribedToChat'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  chatUuid: string,
) {
  // console.log({ uuid, phoneNumber, token })
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(chatUuid)

  const lastRead = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  await psql.query(
    `
                  UPDATE "ChatsPhones"
                  SET
                    "lastReadAt" = $1,
                    "updatedAt" = $2,
                    "unreadCounts" = $3
                  WHERE
                    "chatUuid" = $4
                  AND
                    "phoneNumber" = $5
                    `,
    [lastRead, lastRead, 0, chatUuid, phoneNumber],
  )

  await psql.clean()

  return true
}
