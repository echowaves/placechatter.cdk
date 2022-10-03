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
  if (!(await VALID.auth(uuid, phoneNumber, token))) {
    throw 'Autentication failed'
  }

  const placeUuid = uuidv4()
  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const place = (
    await psql.query(`
                    INSERT INTO "Places"
                    (
                        "placeUuid",
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
                      '${placeUuid}',
                      '${placeName}',
                      '${streetAddress1}',
                      '${streetAddress2}',
                      '${city}',
                      '${country}',
                      '${district}',
                      '${isoCountryCode}',
                      '${postalCode}',
                      '${region}',
                      '${subregion}',
                      '${timezone}',
                      ST_MakePoint(${lat}, ${lon}),
                      '${createdAt}',
                      '${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]
  // console.log({ place })

  const placeOwner = (
    await psql.query(`
                    INSERT INTO "PlaceOwners"
                    (
                        "placeUuid",
                        "phoneNumber",
                        "role",
                        "createdAt"
                    ) values (
                      '${placeUuid}',
                      '${phoneNumber}',
                      'owner',
                      '${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]

  await psql.clean()

  return { place, placeOwner }
}
