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
    await psql.query(
      `
      SELECT * FROM "ActivationRequests"
      WHERE
        "uuid" = $1
        AND "phoneNumber" = $2
        AND "smsCode" = $3
        AND "confirmed" = $4
        AND "createdAt" >= $5
      `,
      [
        uuid,
        phoneNumber,
        smsCode,
        false,
        dayjs().subtract(3, 'minute').format(VALID.dateFormat),
      ],
    )
  ).rows[0]
  // console.log({ activationRequest })
  if (!activationRequest) {
    throw 'No valid pending activation request found'
  }

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

  await psql.query(
    `
      INSERT INTO "Phones"
        (
          "uuid",
          "phoneNumber",
          "nickName",
          "token",
          "createdAt",
          "updatedAt"
        ) values (
          $1,      
          $2,      
          $3,      
          $4,      
          $5,
          $6
        )
      returning *         
      `,
    [uuid, phoneNumber, nickName, token, createdAt, createdAt],
  )

  await psql.query(
    `
    UPDATE "ActivationRequests"
      SET 
        "confirmed" = $1,
        "confirmedAt" = $2
      WHERE
      "uuid" = $3
      and "phoneNumber" = $4
      and "smsCode" = $5
      and "confirmed" = $6
      returning *`,
    [true, createdAt, uuid, phoneNumber, smsCode, false],
  )

  return token
}
