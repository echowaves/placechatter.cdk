export const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS'

export function phoneNumber(phoneNumber: string) {
  if (phoneNumber.length === 10 && /^-?\d+$/.test(phoneNumber)) {
    return true
  }
  return false
}

export function uuid(uuid: string) {
  if (
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
      uuid,
    )
  ) {
    return true
  }
  return false
}

export function nickName(nickName: string) {
  if (
    nickName.length > 3 &&
    nickName.length < 30 &&
    /^[a-zA-Z0-9]$/gi.test(nickName)
  ) {
    return true
  }
  return false
}

export function smsCode(smsCode: string) {
  if (nickName.length === 4 && /^[a-zA-Z0-9]$/gi.test(smsCode)) {
    return true
  }
  return false
}
