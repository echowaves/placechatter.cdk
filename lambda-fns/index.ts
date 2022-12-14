// ******************************************************
//                       queries
// ******************************************************
import nickNameTypeAhead from './controllers/phones/nickNameTypeAhead'
import activationCodeGenerate from './controllers/phones/activationCodeGenerate'
import phoneActivate from './controllers/phones/phoneActivate'

import placeCreate from './controllers/places/placeCreate'
import placeCardCreate from './controllers/places/placeCardCreate'
import placeCardSave from './controllers/places/placeCardSave'
import placeRead from './controllers/places/placeRead'
import placeCardRead from './controllers/places/placeCardRead'
import placesFeed from './controllers/places/placesFeed'
import isValidToken from './controllers/phones/isValidToken'
import isPlaceOwner from './controllers/phones/isPlaceOwner'
import placePhoneList from './controllers/phones/placePhoneList'
import feedbackList from './controllers/feedback/feedbackList'
import placeChatList from './controllers/chats/placeChatList'
import placeChatReadDefault from './controllers/chats/placeChatReadDefault'
import unreadCounts from './controllers/chats/unreadCounts'
import messageList from './controllers/chats/messageList'
import isSubscribedToChat from './controllers/chats/isSubscribedToChat'

// ******************************************************
//                       mutations
// ******************************************************

import generateUploadUrlForCard from './controllers/places/generateUploadUrlForCard'
import placeCardPhotoDelete from './controllers/places/placeCardPhotoDelete'
import placeCardDelete from './controllers/places/placeCardDelete'
import placeCardSwap from './controllers/places/placeCardSwap'
import placeDelete from './controllers/places/placeDelete'

import placePhoneCreate from './controllers/phones/placePhoneCreate'
import placePhoneDelete from './controllers/phones/placePhoneDelete'

import feedbackCreate from './controllers/feedback/feedbackCreate'

import chatSubscribe from './controllers/chats/chatSubscribe'
import chatUnsubscribe from './controllers/chats/chatUnsubscribe'
import messageSend from './controllers/chats/messageSend'
import unreadCountReset from './controllers/chats/unreadCountReset'
import abuseReportCreate from './controllers/chats/abuseReportCreate'

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
    nickName: string // used for authentication
    token: string // used for authentication
    phoneNumber: string // used for authentication
    phone: string // to avoid clashing with authentication phoneNumber

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
    cardUuid1: string
    cardUuid2: string
    photoUuid: string

    feedbackText: string

    messageUuid: string
    chatUuid: string
    lastLoaded: string

    messageText: string

    uuidArg: string
    phoneNumberArg: string
    tokenArg: string

    messageUuidArg: string
    chatUuidArg: string
    messageTextArg: string

    deletedArg: boolean
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

    case 'isValidToken':
      return await isValidToken(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,
      )
    case 'isPlaceOwner':
      return await isPlaceOwner(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
      )
    case 'placePhoneList':
      return await placePhoneList(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
      )
    case 'feedbackList':
      return await feedbackList(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,
      )

    case 'placeChatList':
      return await placeChatList(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
      )
    case 'placeChatReadDefault':
      return await placeChatReadDefault(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
      )
    case 'unreadCounts':
      return await unreadCounts(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,
      )
    case 'messageList':
      return await messageList(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.chatUuid,
        event.arguments.lastLoaded,
      )
    case 'isSubscribedToChat':
      return await isSubscribedToChat(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.chatUuid,
      )

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

    case 'placeCardPhotoDelete':
      return await placeCardPhotoDelete(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,

        event.arguments.photoUuid,
      )
    case 'placeCardDelete':
      return await placeCardDelete(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,

        event.arguments.cardUuid,
      )
    case 'placeCardSwap':
      return await placeCardSwap(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,

        event.arguments.cardUuid1,
        event.arguments.cardUuid2,
      )
    case 'placeDelete':
      return await placeDelete(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.placeUuid,
      )

    case 'placePhoneCreate':
      return await placePhoneCreate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.phone,
        event.arguments.placeUuid,
      )
    case 'placePhoneDelete':
      return await placePhoneDelete(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.phone,
        event.arguments.placeUuid,
      )
    case 'feedbackCreate':
      return await feedbackCreate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.feedbackText,
      )

    case 'chatSubscribe':
      return await chatSubscribe(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.chatUuid,
      )

    case 'chatUnsubscribe':
      return await chatUnsubscribe(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.chatUuid,
      )

    case 'messageSend':
      return await messageSend(
        event.arguments.uuidArg,
        event.arguments.phoneNumberArg,
        event.arguments.tokenArg,

        event.arguments.messageUuidArg,
        event.arguments.chatUuidArg,
        event.arguments.messageTextArg,
        event.arguments.deletedArg,
      )

    case 'unreadCountReset':
      return await unreadCountReset(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.chatUuid,
      )

    case 'abuseReportCreate':
      return await abuseReportCreate(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.token,

        event.arguments.messageUuid,
      )

    default:
      return null
  }
}
