class ActivationCode {
  uuid: string
  phoneNumber: string
  smsCode: string
  confirmed: boolean
  createdAt: string
  confirmedAt: string

  // add custom derived attributes to the object
  public toJSON() {
    return {
      ...this,
    }
  }
}

export default ActivationCode
