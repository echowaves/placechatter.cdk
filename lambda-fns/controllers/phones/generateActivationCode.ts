var AWS = require('aws-sdk')
var SNS = new AWS.SNS()

import psql from '../../psql'
import * as valid from '../../valid'

import * as dayjs from 'dayjs'

const srs = require('secure-random-string')

export default async function main(uuid: string, phoneNumber: string) {
  if (!valid.phoneNumber(phoneNumber)) {
    throw 'Invalid phone number'
  }
  if (!valid.uuid(uuid)) {
    throw 'Invalid uuid'
  }

  await psql.connect()
  const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS') // display
  console.log({ createdAt })

  const smsCode = srs({ length: 4, alphanumeric: true })
  console.log({ smsCode })

  const activationCode = (
    await psql.query(`
                    INSERT INTO "ActivationRequests"
                    (
                        "uuid"
                        ,"phoneNumber"
                        ,"smsCode"
                        ,"createdAt"
                    ) values (
                      '${uuid}'
                      ,'${phoneNumber}'
                      ,'${smsCode}'                      
                      ,'${createdAt}'
                    )
                    returning *
                    `)
  ).rows[0]
  // console.log({ activationCode })

  await psql.clean()

  // send sms to a phoneNumber here
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

  const message = await client.messages.create({
    body: `Activation Code: ${smsCode}`,
    from: '+19303365867',
    to: `+1${phoneNumber}`,
  })

  // console.log({ message })

  return smsCode // 4 alpha numeric
}
