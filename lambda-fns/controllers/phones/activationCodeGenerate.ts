var AWS = require('aws-sdk')
var SNS = new AWS.SNS()

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

const srs = require('secure-random-string')

export default async function main(uuid: string, phoneNumber: string) {
  VALID.uuid(uuid)
  VALID.phoneNumber(phoneNumber)

  await psql.connect()
  const createdAt = dayjs().format(VALID.dateFormat) // display
  console.log({ createdAt })

  const smsCode = srs({ length: 4, alphanumeric: true })
  console.log({ smsCode })

  await psql.query(
    `
      DELETE FROM "Phones"
        WHERE
          "uuid" = $1
        OR
          "phoneNumber" = $2
      returning *         
      `,
    [uuid, phoneNumber],
  )

  const activationCode = (
    await psql.query(
      `
                    INSERT INTO "ActivationRequests"
                    (
                        "uuid",
                        "phoneNumber",
                        "smsCode",
                        "createdAt"
                    ) values (
                      $1,
                      $2,
                      $3,
                      $4
                    )
                    returning *
                    `,
      [uuid, phoneNumber, smsCode, createdAt],
    )
  ).rows[0]
  // console.log({ activationCode })

  await psql.clean()

  // AWS send sms to a phoneNumber here
  // var params = {
  //   PhoneNumber: `+1${phoneNumber}`,
  //   Message: `Activation Code: ${smsCode}`,
  //   MessageAttributes: {
  //     'AWS.SNS.SMS.SMSType': {
  //       DataType: 'String',
  //       StringValue: 'Transactional',
  //     },
  //   },
  // }
  // const publish_resp = await SNS.publish(params).promise()
  // console.log({ publish_resp })

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = require('twilio')(accountSid, authToken)

  // twilio SMS send
  // const message = await client.messages.create({
  //   body: `Your activation code: ${smsCode}`,
  //   from: '+19303365867',
  //   to: `+1${phoneNumber}`,
  // })

  // console.log({ message })

  return smsCode // 4 alpha numeric
}
