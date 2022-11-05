import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  // uuid: string,
  phoneNumber: string,
  nickName: string,
) {
  VALID.phoneNumber(phoneNumber)

  VALID.nickName(nickName)

  await psql.connect()

  const count = (
    await psql.query(
      `
    SELECT COUNT(*)
            FROM "Phones"
            WHERE 
            "nickName" = $1
            AND "phoneNumber" != $2
`,
      [nickName, phoneNumber],
    )
  ).rows[0].count

  await psql.clean()

  return count
}
