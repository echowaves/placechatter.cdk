var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeName: string,
  streetAddress1: string,
  streetAddress2: string,
  city: string,
  country: string,
  district: string,
  isoCountryCode: string,
  postalCode: string,
  region: string,
  subregion: string,
  timezone: string,
  lat: number,
  lon: number,
) {
  // console.log({ uuid, phoneNumber, token })
  await VALID.isValidToken(uuid, phoneNumber, token)

  const placeUuid = uuidv4()
  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const place = (
    await psql.query(
      `
                    INSERT INTO "Places"
                    (
                        "placeUuid",
                        "createdBy", 
                        "placeName",
                        "streetAddress1",
                        "streetAddress2",
                        "city",
                        "country",
                        "district",
                        "isoCountryCode",
                        "postalCode",
                        "region",
                        "subregion",
                        "timezone",
                        "location",
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
                      $9,
                      $10,
                      $11,
                      $12,
                      $13,
                      ST_SetSRID(
                        ST_MakePoint(
                          $14, 
                          $15
                        ),4326),
                      $16,
                      $17
                    )
                    returning *
                    `,
      [
        placeUuid,
        phoneNumber,
        placeName,
        streetAddress1,
        streetAddress2,
        city,
        country,
        district,
        isoCountryCode,
        postalCode,
        region,
        subregion,
        timezone,
        lon,
        lat,
        createdAt,
        createdAt,
      ],
    )
  ).rows[0]
  // console.log({ place })

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
    [placeUuid, phoneNumber, 'owner', createdAt],
  )
  // ).rows[0]

  await psql.clean()

  return place
}
