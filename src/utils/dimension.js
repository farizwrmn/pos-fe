export const formatWeight = (dimension) => {
  try {
    if (dimension) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length > 0) {
        newDimension = splitted[splitted.length - 1]
      }
      return newDimension
    }
    if (dimension === '') {
      return '100 g'
    }
    return dimension
  } catch (error) {
    console.log('formatWeight', error)
    return '100 g'
  }
}

export const formatBox = (dimension) => {
  try {
    if (dimension && dimension.includes('X')) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length === 3) {
        newDimension = splitted[0]
      }
      return newDimension
    }
    if (dimension === '') {
      return '1'
    }
    return '1'
  } catch (error) {
    console.log('formatBox', error)
    return '1'
  }
}

export const formatPack = (dimension) => {
  try {
    if (dimension) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length === 3) {
        newDimension = splitted[1]
      }
      if (splitted && splitted.length === 2) {
        newDimension = splitted[0]
      }
      return newDimension
    }
    if (dimension === '') {
      return '1'
    }
    return dimension
  } catch (error) {
    console.log('formatPack', error)
    return '1'
  }
}

export const formatDimension = (productName) => {
  try {
    let newDimension = ''
    if (productName) {
      const splitted = productName.split(' ')
      if (splitted && splitted.length > 0) {
        const dimension = splitted[splitted.length - 1]
        const dimensionSplit = dimension.split('X')
        if (dimension
          && /^(g|kg|per pack|ml|L)$/.test(dimensionSplit[dimensionSplit.length - 1])
          && splitted[splitted.length - 2]
          && (
            /^([0-9]{1,})$/.test(splitted[splitted.length - 2])
            || splitted[splitted.length - 2].includes('X'))
        ) {
          newDimension = `${splitted[splitted.length - 2]} ${dimension}`
        }
      }
      return newDimension
    }
    return productName
  } catch (e) {
    console.log('formatDimension', e)
    return ''
  }
}
