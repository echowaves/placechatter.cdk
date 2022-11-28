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

  if (await isSubscribedToChat(uuid, phoneNumber, token, chatUuid)) {
    return true // already subscribed
  }

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  await psql.query(
    `
                    INSERT INTO "ChatsPhones"
                    (
                      "chatUuid",
                      "phoneNumber",
                      "optIn",
                      "lastReadAt",
                      "createdAt",
                      "updatedAt"              
                  ) values (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                  )
                  ON CONFLICT  ("chatUuid", "phoneNumber")
                  DO NOTHING
                  returning *                    
                    `,
    [chatUuid, phoneNumber, true, createdAt, createdAt, createdAt],
  )

  await psql.clean()

  return true
}
