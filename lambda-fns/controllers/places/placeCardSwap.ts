const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import placeCardRead from './placeCardRead'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,

  cardUuid1: string,
  cardUuid2: string,
) {
  async function updateSortOrder({
    sortOrder,
    updatedAt,
    cardUuid,
    placeUuid,
  }: {
    sortOrder: number
    updatedAt: string
    cardUuid: string
    placeUuid: string
  }): Promise<boolean> {
    await psql.connect()
    const placeCard = (
      await psql.query(
        `
                    UPDATE "PlacesCards"
                    SET
                      "sortOrder" = $1,
                      "updatedAt" = $2
                      
                    WHERE
                      "cardUuid" = $3
                      AND
                      "placeUuid" = $4
                  
                    returning *
                    `,
        [sortOrder, updatedAt, cardUuid, placeUuid],
      )
    ).rows[0]
    // console.log({ placeCard })
    await psql.clean()
    return true
  }

  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  VALID.uuid(cardUuid1)
  VALID.uuid(cardUuid2)

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  const card1 = await placeCardRead(placeUuid, cardUuid1)
  const card2 = await placeCardRead(placeUuid, cardUuid2)

  const sort1 = card1.sortOrder
  const sort2 = card2.sortOrder

  await updateSortOrder({
    sortOrder: -1,
    updatedAt,
    cardUuid: cardUuid1,
    placeUuid,
  })

  await updateSortOrder({
    sortOrder: sort1,
    updatedAt,
    cardUuid: cardUuid2,
    placeUuid,
  })

  await updateSortOrder({
    sortOrder: sort2,
    updatedAt,
    cardUuid: cardUuid1,
    placeUuid,
  })

  return true
}
