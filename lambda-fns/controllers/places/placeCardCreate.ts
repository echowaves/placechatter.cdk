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

  const sortOrder =
    ((
      await psql.query(`
      SELECT MAX("sortOrder")
              FROM "PlacesCards"
              WHERE 
              "placeUuid" = '${placeUuid}'              
    `)
    ).rows[0].max || 0) + // convert null to 0
    1

  console.log({ sortOrder })

  const placeCard = (
    await psql.query(`
                    INSERT INTO "PlacesCards"
                    (
                        "cardUuid", 
                        "placeUuid",
                        "createdBy", 
                        "cardTitle",
                        "cardText",
                        "sortOrder",
                        "createdAt",
                        "updatedAt"
                    ) values (
                      '${cardUuid}',
                      '${placeUuid}',
                      '${phoneNumber}', 
                      '${cardTitle}',
                      '${cardText}',
                      ${sortOrder},
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
