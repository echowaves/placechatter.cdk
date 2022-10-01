import psql from './psql'

export const VALID = {
  dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',

  phoneNumber: function (phoneNumber: string) {
    if (/^([0-9]){10}$/.test(phoneNumber)) {
      return true
    }
    return false
  },

  uuid: function (uuid: string) {
    if (
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
        uuid,
      )
    ) {
      return true
    }
    return false
  },

  nickName: function (nickName: string) {
    if (/^([a-zA-Z0-9_-]){4,30}$/.test(nickName)) {
      return true
    }
    return false
  },

  smsCode: function (smsCode: string) {
    if (/^([a-zA-Z0-9]){4}$/.test(smsCode)) {
      return true
    }
    return false
  },

  token: function (token: string) {
    if (/^([a-zA-Z0-9]){128}$/.test(token)) {
      return true
    }
    return false
  },

  auth: async function (uuid: string, phoneNumber: string, token: string) {
    if (
      !VALID.uuid(uuid) ||
      !VALID.phoneNumber(phoneNumber) ||
      !VALID.token(token)
    ) {
      return false
    }
    await psql.connect()

    const count = (
      await psql.query(`
        SELECT COUNT(*)
                FROM "Phones"
                WHERE 
                "uuid" = '${uuid}'
                AND "phoneNumber" = '${phoneNumber}'
                AND "token" = '${token}'
      `)
    ).rows[0].count
    await psql.clean()

    return count === 1 ? true : false
  },
}
