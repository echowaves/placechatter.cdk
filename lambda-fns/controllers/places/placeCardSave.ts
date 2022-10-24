var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,

  cardUuid: string,
  cardTitle: string,
  cardText: string,
) {
  // console.log({ uuid, phoneNumber, token })
  await VALID.auth(uuid, phoneNumber, token)
  await VALID.isPhoneInRoleForPlace(uuid, phoneNumber, placeUuid, 'owner')

  await VALID.uuid(cardUuid)
  await VALID.uuid(placeUuid)

  await VALID.cardTitle(cardTitle)
  await VALID.cardText(cardText)

  // const cardUuid = uuidv4()

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const placeCard = (
    await psql.query(`
                    UPDATE "PlacesCards"
                    SET
                      "cardTitle" = '${cardTitle}',
                      "cardText" = '${cardText}',
                      "updatedAt" = '${updatedAt}'
                    WHERE
                      "cardUuid" = '${cardUuid}'
                      AND
                      "placeUuid" = '${placeUuid}'
                  
                    returning *
                    `)
  ).rows[0]
  // console.log({ placeCard })

  await psql.clean()

  return placeCard
}
