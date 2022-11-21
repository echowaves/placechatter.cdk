const AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  feedbackText: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)
  VALID.feedbackText(feedbackText)

  const createdAt = dayjs().format(VALID.dateFormat) // display

  await psql.connect()

  const feedback = (
    await psql.query(
      `
                    INSERT INTO "Feedbacks"
                    (
                        "uuid",
                        "phoneNumber",
                        "feedbackText",
                        "createdAt"
                    ) values (
                      $1,
                      $2,
                      $3,
                      $4
                    )
                    returning *
                    `,
      [uuid, phoneNumber, feedbackText, createdAt],
    )
  ).rows[0]

  await psql.clean()

  return feedback
}
