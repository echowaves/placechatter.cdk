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
) {
  // console.log({ uuid, phoneNumber, token })
  if (!(await VALID.auth(uuid, phoneNumber, token))) {
    throw 'Autentication failed'
  }

  await psql.connect()

  const place = (
    await psql.query(`
                    SELECT * from "Places"
                    WHERE
                    placeUuid = '${placeUuid}' 
                    `)
  ).rows[0]
  console.log({ place })
  const placeOwner = (
    await psql.query(`
                    SELECT * from "PlaceOwners"
                    WHERE
                    placeUuid = '${placeUuid}' 
                    `)
  ).rows[0]
  console.log({ place, placeOwner })

  await psql.clean()

  return { place, placeOwner }
}
