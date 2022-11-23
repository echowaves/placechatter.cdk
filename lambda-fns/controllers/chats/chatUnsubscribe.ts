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

  if (!(await isSubscribedToChat(uuid, phoneNumber, token, chatUuid))) {
    return true // already unsubscribed
  }

  await psql.connect()

  await psql.query(
    `
                    DELETE from "ChatsPhones"
                    WHERE
                      "chatUuid" = $1
                    AND
                      "phoneNumber" = $2
                    `,
    [chatUuid, phoneNumber],
  )

  await psql.clean()

  return true
}
