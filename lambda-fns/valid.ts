export const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS'

export function phoneNumber(phoneNumber: string) {
  if (/^([0-9]){10}$/.test(phoneNumber)) {
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
  if (/^([a-zA-Z0-9_-]){4,30}$/.test(nickName)) {
    return true
  }
  return false
}

export function smsCode(smsCode: string) {
  if (/^([a-zA-Z0-9]){4}$/.test(smsCode)) {
    return true
  }
  return false
}
