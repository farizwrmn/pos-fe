const allowPrint = (printNo, printLimit) => {
  // Undefined
  if (printNo === null || printNo === undefined) return false
  if (printLimit === null || printLimit === undefined) return false

  // Success
  if (printNo < printLimit) return true

  // Already reach limit
  return false
}

export {
  allowPrint
}
