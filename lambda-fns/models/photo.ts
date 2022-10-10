class Photo {
  photoUuid: string
  phoneNumber: string
  active: boolean
  imgUrl: string
  thumbUrl: string

  createdAt: string

  // add custom derived attributes to the object
  public toJSON() {
    return {
      ...this,
      // imgUrl: `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${this.id}`,
      // thumbUrl: `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${this.id}-thumb`,
      imgUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${this.photoUuid}`,
      thumbUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${this.photoUuid}-thumb`,
    }
  }
}

export default Photo
