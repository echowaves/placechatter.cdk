var AWS = require('aws-sdk')
import Message from '../../models/message'
import { plainToClass } from 'class-transformer'

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

  deletedArg: boolean,
) {
  // console.log({ uuid, phoneNumber, token })

  await VALID.isValidToken(uuidArg, phoneNumberArg, tokenArg)
  VALID.uuid(messageUuidArg)
  VALID.uuid(chatUuidArg)

  VALID.messageText(messageTextArg)

  await chatSubscribe(uuidArg, phoneNumberArg, tokenArg, chatUuidArg)

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  let message = null

  if (deletedArg === false) {
    // this is a new message
    message = (
      await psql.query(
        `
                    INSERT INTO "ChatsMessages"
                    (
                      "chatUuid",
                      "messageUuid",
                      "createdBy",
                      "messageText",
                      "createdAt",
                      "updatedAt", 
                      "deleted"
                  ) values (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6, 
                    $7
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
          false,
        ],
      )
    ).rows[0]

    await psql.query(
      `
                  UPDATE "ChatsPhones"
                  SET
                    "updatedAt" = $1,
                    "unreadCounts" = "unreadCounts" + $2
                  WHERE
                    "chatUuid" = $3
                    `,
      [createdAt, 1, chatUuidArg],
    )
  } else {
    // deleting existing message
    // message text param is ignored
    message = (
      await psql.query(
        `
                    UPDATE "ChatsMessages"
                    SET 
                      "deleted" = $1,
                      "updatedAt" = $2
                    WHERE
                      "chatUuid" = $3
                    AND
                      "messageUuid" = $4
                  returning *                    
                    `,
        [true, createdAt, chatUuidArg, messageUuidArg],
      )
    ).rows[0]
  }
  // console.log({ message })

  const { nickName } = (
    await psql.query(
      `
    SELECT *
    FROM "Phones"
    WHERE "phoneNumber" = $1
    `,
      [phoneNumberArg],
    )
  ).rows[0]

  await psql.clean()
  const convertedMessage = plainToClass(Message, message)
  // console.log({ convertedMessage: convertedMessage.toJSON() })

  return { ...convertedMessage.toJSON(), nickName }
}
