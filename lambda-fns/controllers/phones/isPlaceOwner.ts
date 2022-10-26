// import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,
  placeUuid: string,
) {
  return await VALID.isPlaceOwner(uuid, phoneNumber, token, placeUuid)
}
