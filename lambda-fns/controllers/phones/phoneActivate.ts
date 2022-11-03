import psql from '../../psql'
import { VALID } from '../../valid'

const dayjs = require('dayjs')
const srs = require('secure-random-string')

export default async function main(
  uuid: string,
  phoneNumber: string,
  smsCode: string,
  nickName: string,
) {
  // console.log({ phoneNumber, nickName })
  VALID.uuid(uuid)
  VALID.phoneNumber(phoneNumber)
  VALID.smsCode(smsCode)
  VALID.nickName(nickName)

  await psql.connect()
  const createdAt = dayjs().format(VALID.dateFormat) // display
  const token = srs({ length: 128, alphanumeric: true })
  // console.log({ token })
  // console.log('1..............................')
  const activationRequest = (
    await psql.query(`
      SELECT * FROM "ActivationRequests"
      WHERE
        "uuid" = '${uuid}' 
        AND "phoneNumber" = '${phoneNumber}'
        AND "smsCode" = '${smsCode}'
        AND "confirmed" = ${false} 
        AND "createdAt" >= '${dayjs()
          .subtract(3, 'minute')
          .format(VALID.dateFormat)}'
      `)
  ).rows[0]
  // console.log({ activationRequest })
  if (!activationRequest) {
    throw 'No valid pending activation request found'
  }

  await psql.query(`
      DELETE FROM "Phones"
        WHERE
          "uuid" = '${uuid}'
        OR
          "phoneNumber" = '${phoneNumber}'
      returning *         
      `)

  await psql.query(`
      INSERT INTO "Phones"
        (
          "uuid",
          "phoneNumber",
          "nickName",
          "token",
          "createdAt",
          "updatedAt"
        ) values (
          '${uuid}',      
          '${phoneNumber}',      
          '${nickName}',      
          '${token}',      
          '${createdAt}',
          '${createdAt}'
        )
      returning *         
      `)

  await psql.query(`
    UPDATE "ActivationRequests"
      SET 
        "confirmed" = ${true},
        "confirmedAt" = '${createdAt}'
      WHERE
      "uuid" = '${uuid}' 
      and "phoneNumber" = '${phoneNumber}'
      and "smsCode" = '${smsCode}'
      and "confirmed" = ${false}
      returning *`)

  return token
}
