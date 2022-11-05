import psql from './psql'

export const VALID = {
  dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',

  phoneNumber: function (phoneNumber: string) {
    if (!phoneNumber) {
      throw 'Need to confirm phone number'
    }
    if (!/^([0-9]){10}$/.test(phoneNumber)) {
      throw 'Invalid Phone Number format'
    }
  },

  uuid: function (uuid: string) {
    if (
      !/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
        uuid,
      )
    ) {
      throw 'Invalid UUID format'
    }
  },

  nickName: function (param: string) {
    if (!/^([a-zA-Z0-9_-]){4,30}$/.test(param)) {
      throw 'Invalid NickName format'
    }
  },

  smsCode: function (param: string) {
    if (!/^([a-zA-Z0-9]){4}$/.test(param)) {
      throw 'Invalid SMS Code format'
    }
  },

  token: function (param: string) {
    if (!param) {
      throw 'Unconfirmed phone number'
    }
    if (!/^(\w){128}$/.test(param)) {
      throw 'Invalid Token format'
    }
  },

  placeName: function (param: string) {
    if (!/^([\w\s'/_@.#&+-;~]){4,50}$/.test(param)) {
      throw 'Invalid Place Name format'
    }
  },
  streetAddress: function (param: string) {
    if (!/^([\w_@./#&+-\s]){2,50}$/.test(param)) {
      throw 'Invalid Street Address format'
    }
  },
  city: function (param: string) {
    if (!/^([\w_@./#&+-\s]){2,50}$/.test(param)) {
      throw 'Invalid City format'
    }
  },
  region: function (param: string) {
    if (!/^([\w_@./#&+-\s]){2,50}$/.test(param)) {
      throw 'Invalid Region format'
    }
  },
  postalCode: function (param: string) {
    if (!/^([\w_@./#&+-\s]){2,50}$/.test(param)) {
      throw 'Invalid Postal Code format'
    }
  },

  cardTitle: function (param: string) {
    if (!/^([\w\s'/_@.#&+-;~]){4,50}$/.test(param)) {
      throw 'Invalid Card Title'
    }
  },
  cardText: function (param: string) {
    if (!/^(.|\s){4,1024}$/.test(param)) {
      throw 'Invalid Card Text'
    }
  },

  contentType: function (param: string) {
    if (param !== 'image/png') {
      throw 'Invalid Content Type'
    }
  },

  isValidToken: async function (
    uuid: string,
    phoneNumber: string,
    token: string,
  ) {
    // console.log({ uuid: VALID.uuid(uuid) })
    // console.log({ phoneNumber: VALID.phoneNumber(phoneNumber) })
    // console.log({ token: VALID.token(token) })
    VALID.uuid(uuid)
    VALID.phoneNumber(phoneNumber)
    VALID.token(token)

    await psql.connect()

    const count = (
      await psql.query(
        `
        SELECT COUNT(*)
                FROM "Phones"
                WHERE 
                    "uuid" = $1
                AND "phoneNumber" = $2
                AND "token" = $3
      `,
        [uuid, phoneNumber, token],
      )
    )?.rows[0]?.count // should never throw

    await psql.clean()
    // console.log({ count })
    if (count !== '1') {
      throw 'Authentication failed'
    }
    return true
  },

  isPlaceOwner: async function (
    uuid: string,
    phoneNumber: string,
    token: string,
    placeUuid: string,
  ) {
    VALID.uuid(uuid)
    VALID.phoneNumber(phoneNumber)
    VALID.token(token)
    VALID.uuid(placeUuid)

    await VALID.isValidToken(uuid, phoneNumber, token)

    await psql.connect()

    const count = (
      await psql.query(
        `
        SELECT COUNT(*)
                FROM "PlacesPhones"                 
                  WHERE                 
                    "phoneNumber" = $1
                  AND
                    "placeUuid" = $2

                  AND 
                    "role" = 'owner'
      `,
        [phoneNumber, placeUuid],
      )
    )?.rows[0]?.count // should never throw

    await psql.clean()

    if (count !== '1') {
      // throw 'Not the owner of this place'
      return false
    }

    // console.log({ count })
    return true
  },
}
