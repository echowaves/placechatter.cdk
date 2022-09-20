import psql from "../../psql"

export default async function main(
  // uuid: string,
  phoneNumber: string,
  nickName: string,
) {
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
