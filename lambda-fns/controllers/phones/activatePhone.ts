import psql from '../../psql'
import * as valid from '../../valid'

const dayjs = require('dayjs')
const srs = require('secure-random-string')

export default async function main(
  uuid: string,
  phoneNumber: string,
  smsCode: string,
  nickName: string,
) {
  if (!valid.phoneNumber(phoneNumber)) {
    throw 'Invalid phone number'
  }
  if (!valid.uuid(uuid)) {
    throw 'Invalid uuid'
  }
  if (!valid.smsCode(smsCode)) {
    throw 'Invalid smsCode'
  }
  if (!valid.nickName(nickName)) {
    throw 'Invalid nickName'
  }

  await psql.connect()
  const createdAt = dayjs().format(valid.dateFormat) // display
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
