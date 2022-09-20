// import * as moment from 'moment'

const AWS = require("aws-sdk")

// import AbuseReport from '../../models/abuseReport'

export default async function main(uuid: string, phoneNumber: string) {
  const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
  const secretValid = newSecret.length >= 5 && newSecret.length <= 512

  if (!secretValid) {
    throw new Error(`Invalid new Secret`)
  }
  await psql.connect()

  const updatedSecret = (
    await psql.query(`
    UPDATE "Secrets"
                  SET
                    "secret" = '${_hash(newSecret)}',
                    "updatedAt" =  '${updatedAt}'                
                  WHERE
                    "uuid" = '${uuid}'
                    AND
                    "nickName" = '${nickName.toLowerCase()}'
                    AND
                    "secret" = '${_hash(secret)}'
                  returning *
                  `)
  ).rows
  if (updatedSecret.length !== 1) {
    throw new Error(`Failed to update secret`)
  }

  return "the code" // 4 alpha numeric
}
