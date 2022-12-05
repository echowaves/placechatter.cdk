class Message {
  chatUuid: string
  messageUuid: string
  createdBy: string //phone number
  nickName: string
  messageText: string
  createdAt: string
  deleted: boolean

  // add custom derived attributes to the object
  public toJSON() {
    return {
      ...this,
      messageText: this.deleted === true ? '...deleted...' : this.messageText,
    }
  }
}

export default Message
