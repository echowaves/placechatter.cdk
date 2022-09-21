class Phone {
  uuid: string
  phoneNumber: string
  nickName: string
  token: string
  createdAt: string
  updatedAt: string

  // add custom derived attributes to the object
  public toJSON() {
    return {
      ...this,
    }
  }
}

export default Phone
