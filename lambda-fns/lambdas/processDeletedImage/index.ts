import psql from '../../psql'
import * as dayjs from 'dayjs'
import { VALID } from '../../valid'

const AWS = require('aws-sdk')

// eslint-disable-next-line import/prefer-default-export
export async function main(event: any = {}, context: any) {
  const record = event.Records[0]
  const name = record.s3.object.key

  const photoUuid = name.replace('-thumb.webp', '')
  // we only want to deal with originals
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!deleting image: ${name}`)
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!       photoId: ${photoId}`)

  await Promise.all([
    _deleteUpload({ Bucket: record.s3.bucket.name, Key: `${photoUuid}` }),
    _cleanupTables({ photoUuid }),
  ])
  // console.log('everything ended')
  // cb(null, 'success everything')
  return true
}

const _deleteUpload = async ({
  Bucket,
  Key,
}: {
  Bucket: string
  Key: string
}) => {
  // console.log(`_deleteUpload started: ${Key}`)

  try {
    const s3 = new AWS.S3()
    await s3
      .deleteObject({
        Bucket,
        Key,
      })
      .promise()
  } catch (err) {
    console.log('Error deleting object')
    console.log({ err })
  }
  // console.log(`_deleteUpload ended: ${Key}`)
}

const _cleanupTables = async ({ photoUuid }: { photoUuid: string }) => {
  // console.log(`_cleanupTables started: ${photoId}`)

  await psql.connect()
  try {
    await psql.query(
      `
                    DELETE from "Photos"
                    WHERE
                    "photoUuid" = $1
                    `,
      [photoUuid],
    )
    //
  } catch (err) {
    console.log('Error de-activating photo')
    console.log({ err })
  }
  // console.log(`_cleanupTables ended 1: ${photoId}`)
  const updatedAt = dayjs().format(VALID.dateFormat) // display

  try {
    await psql.query(
      `
                        UPDATE "PlacesCards"
                        SET
                          "photoUuid" = $1,
                          "updatedAt" = $2                          
                        WHERE
                          "photoUuid" = $3
                        returning *
                        `,
      [null, updatedAt, photoUuid],
    )
    //
  } catch (err) {
    console.log('Error cleaning up PlacesPhotos')
    console.log({ err })
  }
  // console.log(`_cleanupTables ended 2: ${photoId}`)

  await psql.clean()
  // console.log(`_cleanupTables ended: ${photoId}`)
}
