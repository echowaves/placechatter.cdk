import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  // uuid: string,
  phoneNumber: string,
  nickName: string,
) {
  if (!VALID.phoneNumber(phoneNumber)) {
    throw 'Invalid phone number'
  }
  if (!VALID.nickName(nickName)) {
    throw 'Invalid nickName'
  }

  await psql.connect()

  const count = (
    await psql.query(`
    SELECT COUNT(*)
            FROM "Phones"
            WHERE 
            "nickName" = '${nickName}'
            AND "phoneNumber" != '${phoneNumber}'
`)
  ).rows[0].count

  await psql.clean()

  return count
}
