// ******************************************************
//                       queries
// ******************************************************


// ******************************************************
//                       mutations
// ******************************************************


// import AbuseReport from './models/abuseReport'
// import Photo from './models/photo'
// import Message from './models/message'

type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    // photo: Photo,
    // abuseReport: AbuseReport,
    placeId: string,
    uuid: string,
    lat: number,
    lon: number,
    pageNumber: number,
    searchTerm: string,
    description: string,
    commentId: bigint,
    video: boolean,
    assetKey: string,
    contentType: string,
    nickName: string,
    secret: string,
    newSecret: string,
    friendshipUuid: string,
    invitedByUuid: string,
    chatUuid: string,
    messageUuid: string,
    text: string,

  }
}

exports.handler = async (event:AppSyncEvent) => {
  switch (event.info.fieldName) {
    // ******************************************************
    //                       queries
    // ******************************************************

    case 'generateUploadUrl':
      return await generateUploadUrl(
        event.arguments.assetKey,
        event. arguments.contentType,
      )
    case 'generateUploadUrlForMessage':
      return await generateUploadUrlForMessage(
        event.arguments.uuid,
        event.arguments.photoHash,
        event. arguments.contentType,
      )

      // ******************************************************
      //                       mutations
      // ******************************************************


    default:
      return null
  }
}
