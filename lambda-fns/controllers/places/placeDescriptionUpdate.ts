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
  description: string,
) {
  // console.log({ uuid, phoneNumber, token })
  if (!(await VALID.auth(uuid, phoneNumber, token))) {
    throw 'Autentication failed'
  }

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const place = (
    await psql.query(`
                    UPDATE "Places"
                    SET 
                      "description" = ${description},
                      "updatedAt" = '${updatedAt}'
                    WHERE
                      "placeUuid" = '${placeUuid}'                     
                    returning *`)
  ).rows[0]
  await psql.clean()

  return 'OK'
}
