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
  cardTitle: string,
  cardText: string,
) {
  // console.log({ uuid, phoneNumber, token })
  await VALID.auth(uuid, phoneNumber, token)
  await VALID.isPhoneInRoleForPlace(uuid, phoneNumber, placeUuid, 'owner')

  await VALID.uuid(placeUuid)

  await VALID.cardTitle(cardTitle)
  await VALID.cardText(cardText)

  const cardUuid = uuidv4()

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const placeCard = (
    await psql.query(`
                    INSERT INTO "PlacesCards"
                    (
                        "cardUuid", 
                        "placeUuid",
                        "createdBy", 
                        "cardTitle",
                        "cardText",
                        "createdAt",
                        "updatedAt"
                    ) values (
                      '${cardUuid}',
                      '${placeUuid}',
                      '${phoneNumber}', 
                      '${cardTitle}',
                      '${cardText}',
                      '${createdAt}',
                      '${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]
  // console.log({ placeCard })

  await psql.clean()

  return placeCard
}
