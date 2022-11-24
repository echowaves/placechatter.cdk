const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'
import placeChatList from '../chats/placeChatList'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,
) {
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  await psql.connect()

  const count = (
    await psql.query(
      `
      SELECT COUNT(*)
              FROM "PlacesCards"
              WHERE 
                  "placeUuid" = $1
    `,
      [placeUuid],
    )
  )?.rows[0]?.count // should never throw

  await psql.clean()
  // console.log({ count })
  if (count !== '0') {
    throw 'Delete All Cards first'
  }

  await psql.connect()

  await psql.query(
    `
                    DELETE from "PlacesPhones"
                    WHERE
                      "placeUuid" = $1
                    returning *
                    `,
    [placeUuid],
  )

  // delete all placeChats
  const placeChats = await placeChatList(
    uuid,
    phoneNumber,
    token,

    placeUuid,
  )

  placeChats.forEach(async (placeChat: { chatUuid: any }) => {
    await psql.query(
      `
                      DELETE from "ChatsMessages"
                      WHERE
                        "chatUuid" = $1
                      returning *
                      `,
      [placeChat.chatUuid],
    )
    await psql.query(
      `
                      DELETE from "ChatsPhones"
                      WHERE
                        "chatUuid" = $1
                      returning *
                      `,
      [placeChat.chatUuid],
    )
    await psql.query(
      `
                      DELETE from "PlacesChats"
                      WHERE
                        "chatUuid" = $1
                      returning *
                      `,
      [placeChat.chatUuid],
    )
  })

  // now delete the place
  await psql.query(
    `
                    DELETE from "Places"
                    WHERE
                      "placeUuid" = $1
                    returning *
                    `,
    [placeUuid],
  )
  // ).rows[0]

  await psql.clean()

  return true
}
