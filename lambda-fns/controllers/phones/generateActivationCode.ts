var AWS = require('aws-sdk')
var SNS = new AWS.SNS()

import psql from '../../psql'

import * as dayjs from 'dayjs'

const srs = require('secure-random-string')

export default async function main(uuid: string, phoneNumber: string) {
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
  console.log({ activationCode })

  await psql.clean()

  // send sms to a phoneNumber here
  var params = {
    PhoneNumber: `+1${phoneNumber}`,
    Message: `Activation Code: ${smsCode}`,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional',
      },
    },
  }
  await SNS.publish(params)

  return smsCode // 4 alpha numeric
}
