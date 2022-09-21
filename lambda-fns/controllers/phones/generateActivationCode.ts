var AWS = require("aws-sdk")
var SNS = new AWS.SNS()

import psql from "../../psql"

const dayjs = require("dayjs")
const srs = require("secure-random-string")

export default async function main(uuid: string, phoneNumber: string) {
  await psql.connect()
  const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS") // display
  const smsCode = srs({ length: 4, alphanumeric: true })

  const activationCode = (
    await psql.query(`
                    INSERT INTO "ActivationRequests"
                    (
                        "uuid",
                        "phoneNumber",
                        "smsCode",
                        "createdAt",
                    ) values (
                      '${uuid}',
                      '${phoneNumber}',
                      '${smsCode}',                      
                      '${createdAt}',
                    )
                    returning *
                    `)
  ).rows[0]

  await psql.clean()

  // send sms to a phoneNumber here
  var params = {
    PhoneNumber: phoneNumber,
    Message: `Activation Code: ${smsCode}`,
  }
  await SNS.publish(params)

  return smsCode // 4 alpha numeric
}
