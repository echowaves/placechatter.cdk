var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import chatSubscribe from './chatSubscribe'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  chatUuid: string,
  messageText: string,
) {
  // console.log({ uuid, phoneNumber, token })

  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(chatUuid)

  await chatSubscribe(uuid, phoneNumber, token, chatUuid)

  const createdAt = dayjs().format(VALID.dateFormat) // display
  const messageUuid = uuidv4()

  await psql.connect()

  const message = (
    await psql.query(
      `
                    INSERT INTO "ChatsMessages"
                    (
                      "chatUuid",
                      "messageUuid",
                      "createdBy",
                      "messageText",
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
                  returning *                    
                    `,
      [chatUuid, messageUuid, phoneNumber, messageText, createdAt, createdAt],
    )
  ).rows[0]

  await psql.clean()

  return message
}
