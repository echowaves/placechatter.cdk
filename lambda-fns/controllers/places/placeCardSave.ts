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
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  VALID.cardTitle(cardTitle)
  VALID.cardText(cardText)

  // const cardUuid = uuidv4()

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const placeCard = (
    await psql.query(
      `
                    UPDATE "PlacesCards"
                    SET
                      "cardTitle" = $1,
                      "cardText" = $2,
                      "updatedAt" = $3
                      
                    WHERE
                      "cardUuid" = $4
                      AND
                      "placeUuid" = $5
                  
                    returning *
                    `,
      [cardTitle, cardText, updatedAt, cardUuid, placeUuid],
    )
  ).rows[0]
  // console.log({ placeCard })

  await psql.clean()

  return placeCard
}
