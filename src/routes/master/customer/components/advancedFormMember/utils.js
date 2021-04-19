export const getValidationValue = (list, { formName, fieldName, value, defaultValue }) => {
  const filteredField = list.filter(filtered => filtered.formName === formName && filtered.fieldName === fieldName)
  if (filteredField && filteredField[0]) {
    const validation = filteredField[0].validation
    return validation[value]
  }
  return defaultValue
}
