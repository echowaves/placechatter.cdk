import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,
) {
  await VALID.isValidToken(uuid, phoneNumber, token)

  await psql.connect()

  const feedbacks = (
    await psql.query(
      `
      SELECT *
      FROM "Feedbacks"
      WHERE "phoneNumber" =  $1
      ORDER BY "createdAt" DESC
      LIMIT 10
    `,
      [phoneNumber],
    )
  ).rows

  await psql.clean()

  return feedbacks
}
