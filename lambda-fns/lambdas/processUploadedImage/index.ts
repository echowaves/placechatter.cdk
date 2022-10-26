import psql from '../../psql'
import { VALID } from '../../valid'

const AWS = require('aws-sdk')

const sharp = require('sharp')
import * as dayjs from 'dayjs'

// eslint-disable-next-line import/prefer-default-export
export async function main(event: any = {}, context: any) {
  // // define all the thumbnails that we want
  // const widths = {
  //   300: '-thumbnail x300', // converting to the height of 300
  // }
  //
  const record = event.Records[0]
  const name = record.s3.object.key
  const photoUuid = name.replace('.upload', '')
  const Bucket = record.s3.bucket.name
  // we only want to deal with originals
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!received image: ${name}`)
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!       photoId: ${photoId}`)

  const s3 = new AWS.S3()
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!   ended 1    photoId: ${photoId}`)

  let image = await s3
    .getObject({
      Bucket,
      Key: name,
    })
    .promise()
  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!   ended 2    photoId: ${photoId}`)

  await Promise.all([
    _genWebpThumb({ image, Bucket, Key: `${photoUuid}-thumb.webp` }),
    _genWebp({ image, Bucket, Key: `${photoUuid}.webp` }),
  ])

  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!   ended 3    photoId: ${photoId}`)

  await Promise.all([
    _deleteUpload({ Bucket, Key: name }),
    _activatePhoto({ photoUuid }),
  ])

  // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!   ended 4   photoId: ${photoId}`)

  // cb(null, 'success everything')
  return true
}

const _genWebpThumb = async ({
  image,
  Bucket,
  Key,
}: {
  image: any
  Bucket: string
  Key: string
}) => {
  // console.log(`_genWebpThumb started  ${Key}`)
  const buffer = await sharp(image.Body)
    .rotate()
    .webp({ lossless: false, quality: 80 })
    .resize({ height: 300 })
    .toBuffer()
  const s3 = new AWS.S3()
  await s3
    .putObject({
      Bucket,
      Key,
      Body: buffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    })
    .promise()

  // console.log(`_genWebpThumb ended  ${Key}`)
}

const _genWebp = async ({
  image,
  Bucket,
  Key,
}: {
  image: any
  Bucket: string
  Key: string
}) => {
  // console.log(`_genWebp started  ${Key}`)

  const buffer = await sharp(image.Body)
    .rotate()
    .webp({ lossless: false, quality: 90 })
    .toBuffer()
  const s3 = new AWS.S3()
  await s3
    .putObject({
      Bucket,
      Key,
      Body: buffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    })
    .promise()
  // console.log(`_genWebp ended  ${Key}`)
}

const _deleteUpload = async ({
  Bucket,
  Key,
}: {
  Bucket: string
  Key: string
}) => {
  // console.log(`_deleteUpload started  ${Key}`)

  const s3 = new AWS.S3()
  await s3
    .deleteObject({
      Bucket,
      Key,
    })
    .promise()
  // console.log(`_deleteUpload ended  ${Key}`)
}

const _activatePhoto = async ({ photoUuid }: { photoUuid: string }) => {
  console.log(`_activatePhoto started  ${photoUuid}`)

  try {
    const updatedAt = dayjs().format(VALID.dateFormat) // display

    await psql.connect()
    const updatedPhoto = await psql.query(`    
                    UPDATE "Photos"
                    SET 
                      active = true, 
                      "updatedAt" = '${updatedAt}'
                    WHERE
                      "photoUuid" = '${photoUuid}'
                    RETURNING *
                    `)
    console.log({ updatedPhoto })
  } catch (err) {
    console.log('Error activating photo')
    console.log({ err })
  }
  await psql.clean()
  // console.log(`_activatePhoto ended  ${photoId}`)
}
