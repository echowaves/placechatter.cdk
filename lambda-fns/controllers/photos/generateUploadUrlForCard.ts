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

  assetKey: string, // photo uuid generated in the client, as such, need to validate the format
  contentType: string,
  placeUuid: string,
  cardUuid: string,
) {
  const photoUuid = assetKey

  await VALID.auth(uuid, phoneNumber, token)
  await VALID.isPhoneInRoleForPlace(uuid, phoneNumber, placeUuid, 'owner')

  VALID.uuid(photoUuid)
  VALID.contentType(contentType)
  VALID.uuid(placeUuid)
  VALID.uuid(cardUuid)

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const photo = (
    await psql.query(`
                    INSERT INTO "Photos"
                    (
                        "photoUuid",
                        "cratedBy",
                        "active",
                        "createdAt",
                        "updatedAt"
                    ) values (
                      '${photoUuid}',
                      '${phoneNumber}',
                      false,
                      '${createdAt}',
                      '${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]
  // console.log({ photo })

  // const placeRole = (
  await psql.query(`
                    UPDATE "PlacesCards"
                    SET
                      "photoUuid" = '${photoUuid}',
                      "updatedAt" = '${createdAt}'
                    WHERE
                      "cardUuid" = '${cardUuid}'
                    AND
                      "placeUuid" = '${placeUuid}'
                    returning *
                    `)
  // ).rows[0]

  await psql.clean()

  const s3 = new AWS.S3()
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${assetKey}.upload`,
    ContentType: contentType,
    Expires: 60 * 60, // expires in 1 minute * 60 minutes, after that request a new URL
    ACL: 'public-read',
  }

  const uploadUrl = s3.getSignedUrl('putObject', s3Params)

  return { uploadUrl, photo: plainToClass(Photo, photo) }
}
