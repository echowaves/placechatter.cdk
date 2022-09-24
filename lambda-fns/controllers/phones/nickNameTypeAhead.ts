import psql from '../../psql'
import * as valid from '../../valid'

export default async function main(
  // uuid: string,
  phoneNumber: string,
  nickName: string,
) {
  if (!valid.phoneNumber(phoneNumber)) {
    throw 'Invalid phone number'
  }
  if (!valid.nickName(nickName)) {
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
