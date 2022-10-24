// ******************************************************
//                       queries
// ******************************************************
import nickNameTypeAhead from './controllers/phones/nickNameTypeAhead'
import activationCodeGenerate from './controllers/phones/activationCodeGenerate'
import phoneActivate from './controllers/phones/phoneActivate'

// ******************************************************
//                       mutations
// ******************************************************
import placeCreate from './controllers/places/placeCreate'
import placeCardCreate from './controllers/places/placeCardCreate'
import placeCardSave from './controllers/places/placeCardSave'
import placeRead from './controllers/places/placeRead'
import placeCardRead from './controllers/places/placeCardRead'
import placesFeed from './controllers/places/placesFeed'
import generateUploadUrlForCard from './controllers/photos/generateUploadUrlForCard'

// ******************************************************
//                       mutations
// ******************************************************

// import AbuseReport from './models/abuseReport'
// import Photo from './models/photo'
// import Message from './models/message'

type AppSyncEvent = {
  info: {
    fieldName: string
  }
  arguments: {
    uuid: string
    lat: number
    lon: number
    pageNumber: number
    commentId: bigint
    video: boolean
    assetKey: string
    nickName: string
    token: string
    phoneNumber: string
    smsCode: string

    placeName: string
    streetAddress1: string
    streetAddress2: string
    city: string
    country: string
    district: string
    isoCountryCode: string
    postalCode: string
    region: string
    subregion: string
    timezone: string

    placeUuid: string

    contentType: string

    cardTitle: string
    cardText: string
    cardUuid: string
  }
}

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    // ******************************************************
    //                       queries
    // ******************************************************
    case 'nickNameTypeAhead':
      return await nickNameTypeAhead(
        event.arguments.phoneNumber,
        event.arguments.nickName,
      )
    case 'placeRead':
      return await placeRead(
        // event.arguments.uuid,
        // event.arguments.phoneNumber,
        // event.arguments.token,

        event.arguments.placeUuid,
      )
    case 'placeCardRead':
      return await placeCardRead(
        // event.arguments.uuid,
        // event.arguments.phoneNumber,
        // event.arguments.token,

        event.arguments.placeUuid,
        event.arguments.cardUuid,
      )

    case 'placesFeed':
      return await placesFeed(event.arguments.lat, event.arguments.lon)
    // ******************************************************
    //                       mutations
    // ******************************************************
    // Phones
    case 'activationCodeGenerate':
      return await activationCodeGenerate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
      )

    case 'phoneActivate':
      return await phoneActivate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.smsCode,
        event.arguments.nickName,
      )

    case 'placeCreate':
      return await placeCreate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeName,
        event.arguments.streetAddress1,
        event.arguments.streetAddress2,
        event.arguments.city,
        event.arguments.country,
        event.arguments.district,
        event.arguments.isoCountryCode,
        event.arguments.postalCode,
        event.arguments.region,
        event.arguments.subregion,
        event.arguments.timezone,
        event.arguments.lat,
        event.arguments.lon,
      )

    case 'placeCardCreate':
      return await placeCardCreate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
        event.arguments.cardTitle,
        event.arguments.cardText,
      )

    case 'placeCardSave':
      return await placeCardSave(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,

        event.arguments.cardUuid,
        event.arguments.cardTitle,
        event.arguments.cardText,
      )

    case 'generateUploadUrlForCard':
      return await generateUploadUrlForCard(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.assetKey,
        event.arguments.contentType,
        event.arguments.placeUuid,
        event.arguments.cardUuid,
      )

    default:
      return null
  }
}
