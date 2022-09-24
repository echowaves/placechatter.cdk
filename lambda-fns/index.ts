// ******************************************************
//                       queries
// ******************************************************
import nickNameTypeAhead from './controllers/phones/nickNameTypeAhead'
import generateActivationCode from './controllers/phones/generateActivationCode'
import activatePhone from './controllers/phones/activatePhone'

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
    // ******************************************************
    //                       mutations
    // ******************************************************
    // Phones
    case 'generateActivationCode':
      return await generateActivationCode(
        event.arguments.uuid,
        event.arguments.phoneNumber,
      )

    case 'activatePhone':
      return await activatePhone(
        event.arguments.uuid,
        event.arguments.phoneNumber,
        event.arguments.smsCode,
        event.arguments.nickName,
      )

    default:
      return null
  }
}
