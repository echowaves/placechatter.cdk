import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,

  placeUuid: string,
) {
  if (!(await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid))) {
    throw 'Not a place owner'
  }

  await psql.connect()

  const placesPhones = (
    await psql.query(
      `
      SELECT *
      FROM "PlacesPhones"
      WHERE "placeUuid" =  $1
      ORDER BY "phoneNumber"
      LIMIT 100
    `,
      [placeUuid],
    )
  ).rows

  await psql.clean()

  return placesPhones
}
