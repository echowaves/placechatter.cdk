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
  // await VALID.isValidToken(uuid, phoneNumber, token)
  await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid)

  await VALID.cardTitle(cardTitle)
  await VALID.cardText(cardText)

  const cardUuid = uuidv4()

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const sortOrder =
    ((
      await psql.query(
        `
      SELECT MAX("sortOrder")
              FROM "PlacesCards"
              WHERE 
              "placeUuid" = $1          
    `,
        [placeUuid],
      )
    ).rows[0].max || 0) + // convert null to 0
    1

  // console.log({ sortOrder })

  const placeCard = (
    await psql.query(
      `
                    INSERT INTO "PlacesCards"
                    (
                        "cardUuid", 
                        "placeUuid",
                        "createdBy", 
                        "cardTitle",
                        "cardText",
                        "active",
                        "sortOrder",
                        "createdAt",
                        "updatedAt"
                    ) values (
                      $1,
                      $2,
                      $3, 
                      $4,
                      $5,
                      $6, 
                      $7,
                      $8,
                      $9
                    )
                    returning *
                    `,
      [
        cardUuid,
        placeUuid,
        phoneNumber,
        cardTitle,
        cardText,
        true,
        sortOrder,
        createdAt,
        createdAt,
      ],
    )
  ).rows[0]
  // console.log({ placeCard })

  await psql.clean()

  return placeCard
}
