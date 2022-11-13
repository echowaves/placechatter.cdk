const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import { plainToClass } from 'class-transformer'
import Photo from '../../models/photo'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  phone: string,
  placeUuid: string,
) {
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  VALID.phoneNumber(phone)

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const placePhone = (
    await psql.query(
      `
                    INSERT INTO "PlacesPhones"
                    (
                        "placeUuid",
                        "phoneNumber",
                        "role",
                        "createdAt"
                    ) values (
                      $1,
                      $2,
                      $3,
                      $4
                    )
                    returning *
                    `,
      [placeUuid, phone, 'owner', createdAt],
    )
  ).rows[0]

  // console.log({ placePhone })
  const phoneJoin = (
    await psql.query(
      `
                  SELECT * FROM "Phones"
                  WHERE 
                  "phoneNumber" = $1
                    `,
      [phone],
    )
  ).rows[0]

  // console.log({ phoneJoin })

  await psql.clean()

  return { ...placePhone, nickName: phoneJoin?.nickName }
}
