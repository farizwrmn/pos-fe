export const formatTimeBCA = (transTime) => {
  if (transTime) {
    let resultTime = ''
    let hourNumber = transTime.substring(0, 2)
    let minuteNumber = ''
    if (Number(hourNumber) > 23) {
      hourNumber = `0${transTime.substring(0, 2)}`
      minuteNumber = transTime.substring(2, 4)
      if (Number(minuteNumber) > 59) {
        minuteNumber = `0${transTime.substring(2, 3)}`
      }
    } else {
      hourNumber = transTime.substring(0, 2)
      minuteNumber = transTime.substring(2, 4)
      if (Number(minuteNumber) > 59) {
        minuteNumber = `0${transTime.substring(2, 3)}`
      }
    }
    resultTime = `${hourNumber}:${minuteNumber}`
    return resultTime
  }
  return transTime
}
