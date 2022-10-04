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
  if (!VALID.phoneNumber(phoneNumber)) {
    throw 'Invalid phone number'
  }
  if (!VALID.uuid(uuid)) {
    throw 'Invalid uuid'
  }
  if (!VALID.smsCode(smsCode)) {
    throw 'Invalid smsCode'
  }
  if (!VALID.nickName(nickName)) {
    throw 'Invalid nickName'
  }

  await psql.connect()
  const createdAt = dayjs().format(VALID.dateFormat) // display
  const token = srs({ length: 128, alphanumeric: true })
  // console.log('1..............................')
  const activationRequest = (
    await psql.query(`
      SELECT * FROM "ActivationRequests"
      WHERE
        "uuid" = '${uuid}' 
        and "phoneNumber" = '${phoneNumber}'
        and "smsCode" = '${smsCode}'
        and "confirmed" = ${false} 
        and "createdAt" >= '${createdAt.subtract(3, 'minute')}'
      `)
  ).rows[0]
  // console.log({ activationRequest })
  if (!activationRequest) {
    throw 'No valid pending activation request found'
  }

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
      ON CONFLICT("phoneNumber" ) 
      DO UPDATE 
      SET 
      "uuid" = '${uuid}',                 
      "nickName" = '${nickName}', 
      "token" = '${token}',
      "updatedAt" =  '${createdAt}'       
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
