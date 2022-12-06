var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

import isSubscribedToChat from './isSubscribedToChat'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  messageUuid: string,
) {
  // console.log({ uuid, phoneNumber, token })
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.uuid(messageUuid)

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const abuseReport = (
    await psql.query(
      `
                  INSERT INTO "AbuseReports"
                  (
                    "messageUuid",
                    "createdBy",
                    "createdAt",
                ) values (
                  $1,
                  $2,
                  $3
                )
                returning *                    
                  `,
      [messageUuid, phoneNumber, createdAt],
    )
  ).rows[0]

  await psql.clean()

  return abuseReport ? true : false
}
