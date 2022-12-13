var AWS = require('aws-sdk')
var SNS = new AWS.SNS()

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

const srs = require('secure-random-string')

export default async function main(uuid: string, phoneNumber: string) {
  VALID.uuid(uuid)
  VALID.phoneNumber(phoneNumber)

  // const testPhoneNumber = '3232223333'

  await psql.connect()
  const createdAt = dayjs().format(VALID.dateFormat) // display
  console.log({ createdAt })

  let smsCode = srs({ length: 4, alphanumeric: true })

  // hardcode sms code for testPhoneNumber
  // if (phoneNumber === testPhoneNumber) {
  //   smsCode = '4242'
  // }

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

  // skip sending message for area code 000
  if (phoneNumber.startsWith('000')) {
    return smsCode // 4 alpha numeric
  }

  // skip sending message for test phone number
  // if (phoneNumber === testPhoneNumber) {
  //   return smsCode // 4 alpha numeric
  // }

  // send sms via aws
  var params = {
    PhoneNumber: `+1${phoneNumber}`,
    Message: `Placechatter security code: ${smsCode}`,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional',
      },
      'AWS.MM.SMS.OriginationNumber': {
        DataType: 'String',
        StringValue: '+18778901884', // origination number should be in E.164 format
      },
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: 'PlaceChater', // origination number should be in E.164 format
      },
    },
  }

  const publish_resp = await SNS.publish(params).promise()
  // console.log({ publish_resp })
  /////////////////////////////////////////////////////////////////////////////////

  // send sms via twillio
  // const accountSid = process.env.TWILIO_ACCOUNT_SID
  // const authToken = process.env.TWILIO_AUTH_TOKEN
  // const client = require('twilio')(accountSid, authToken)

  // // twilio SMS send
  // const message = await client.messages.create({
  //   body: `Your Placechatter verification code is: ${smsCode}`,
  //   from: '+19303365867',
  //   to: `+1${phoneNumber}`,
  // })
  /////////////////////////////////////////////////////////////////////////////////

  // console.log({ message })

  return smsCode // 4 alpha numeric
}
