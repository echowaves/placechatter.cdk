const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  assetKey: string, // photo uuid generated in the client, as such, need to validate the format
  contentType: string,
  placeUuid: string,
) {
  const photoUuid = assetKey

  if (!(await VALID.auth(uuid, phoneNumber, token))) {
    throw 'Autentication failed'
  }

  if (
    !(await VALID.isPhoneInRoleForPlace(uuid, phoneNumber, placeUuid, 'owner'))
  ) {
    throw 'Not the owner of this place'
  }

  if (!VALID.uuid(photoUuid)) {
    throw 'Invalid assetKey'
  }
  if (!VALID.contentType(contentType)) {
    throw 'Invalid content type'
  }
  if (placeUuid && !VALID.uuid(placeUuid)) {
    throw 'Invalid place reference'
  }

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const photo = (
    await psql.query(`
                    INSERT INTO "Photos"
                    (
                        "photoUuid",
                        "phoneNumber",
                        "active",
                        "createdAt"
                    ) values (
                      '${photoUuid}',
                      '${phoneNumber}',
                      false,
                      '${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]
  // console.log({ photo })

  // const placeRole = (
  await psql.query(`
                    INSERT INTO "PlacesPhotos"
                    (
                        "placeUuid",
                        "photoUuid",
                        "createdAt",
                        "updatedAt"
                    ) values (
                      '${placeUuid}',
                      '${photoUuid}',
                      '${createdAt}',
                      '${createdAt}'
                    )
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

  return uploadUrl
}
