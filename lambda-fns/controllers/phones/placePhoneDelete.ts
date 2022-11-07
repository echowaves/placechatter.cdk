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

  if (phone === phoneNumber) {
    throw 'Unable to delete self'
  }

  await psql.connect()

  await psql.query(
    `
                      DELETE from "PlacesPhones"
                      WHERE
                        "placeUuid" = $1
                      AND
                        "phoneNumber" = $2
                      returning *
                      `,
    [placeUuid, phone],
  )

  await psql.clean()

  return true
}
