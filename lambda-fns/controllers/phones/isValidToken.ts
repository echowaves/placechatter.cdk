import psql from '../../psql'
import { VALID } from '../../valid'

export default async function main(
  uuid: string,
  phoneNumber: string,
  token: string,
) {
  return await VALID.isValidToken(uuid, phoneNumber, token)
}
