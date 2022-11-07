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

  placeUuid: string,

  photoUuid: string,
) {
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  const updatedAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const updatedPhoto = await psql.query(
    `    
  UPDATE "Photos"
  SET
    "active" = $1, 
    "updatedAt" = $2
  WHERE
    "photoUuid" = $3
  RETURNING *
  `,
    [false, updatedAt, photoUuid],
  )

  // console.log({ updatedPhoto })

  // console.log({ photo })

  await psql.query(
    `
                    UPDATE "PlacesCards"
                    SET
                      "photoUuid" = $1,
                      "updatedAt" = $2
                    WHERE
                      "photoUuid" = $3
                    AND
                      "placeUuid" = $4
                    returning *
                    `,
    [null, updatedAt, photoUuid, placeUuid],
  )
  // ).rows[0]

  await psql.clean()

  const s3 = new AWS.S3()

  const r1 = await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET,
      Key: `${photoUuid}.webp`,
    })
    .promise()

  const r2 = await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET,
      Key: `${photoUuid}-thumb.webp`,
    })
    .promise()

  // console.log({ r1, r2 })
  // return { uploadUrl, photo: plainToClass(Photo, photo) }
  return true
}
