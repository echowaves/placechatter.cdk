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
