var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import chatSubscribe from './chatSubscribe'

export default async function main(
  uuidArg: string,
  phoneNumberArg: string,
  tokenArg: string,

  messageUuidArg: string,
  chatUuidArg: string,
  messageTextArg: string,
) {
  // console.log({ uuid, phoneNumber, token })

  await VALID.isValidToken(uuidArg, phoneNumberArg, tokenArg)
  VALID.uuid(messageUuidArg)
  VALID.uuid(chatUuidArg)

  await chatSubscribe(uuidArg, phoneNumberArg, tokenArg, chatUuidArg)

  const createdAt = dayjs().format(VALID.dateFormat) // display

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
      [
        chatUuidArg,
        messageUuidArg,
        phoneNumberArg,
        messageTextArg,
        createdAt,
        createdAt,
      ],
    )
  ).rows[0]

  await psql.query(
    // update all chats
    `
                  UPDATE "ChatsPhones"
                  SET
                    "updatedAt" = $1
                  WHERE
                    "chatUuid" = $2
                    `,
    [createdAt, chatUuidArg],
  )

  const { nickName } = await psql.query(
    `
    SELECT *
    FROM "Phones"
    WHERE "phoneNumber" = $1
    `,
    [phoneNumberArg],
  ).rows[0]

  await psql.clean()

  return { ...message, nickName }
}
