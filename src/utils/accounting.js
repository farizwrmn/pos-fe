export const generateListBalanceSheetChildType = (accountType, listBalanceSheet, listChild) => {
  const newListBalanceSheet = [
    ...listBalanceSheet
  ]
  if (!listChild || (listChild && listChild.length === 0)) {
    return listBalanceSheet
  }
  if (!listBalanceSheet || (listBalanceSheet && listBalanceSheet.length === 0)) {
    return listBalanceSheet
  }
  for (let key in newListBalanceSheet) {
    const mainItem = newListBalanceSheet[key]
    if (mainItem.children) {
      for (let second in mainItem.children) {
        const secondItem = mainItem.children[second]
        if (secondItem.children) {
          for (let third in secondItem.children) {
            const thirdItem = secondItem.children[third]
            if (thirdItem.type === accountType) {
              newListBalanceSheet[key].children[second].children[third].children = listChild
              newListBalanceSheet[key].children[second].children[third].bodyTitle = `Jumlah ${newListBalanceSheet[key].children[second].children[third].bodyTitle}`
            }
          }
        }
        if (secondItem.type === accountType) {
          newListBalanceSheet[key].children[second].children = listChild
          newListBalanceSheet[key].children[second].bodyTitle = `Jumlah ${newListBalanceSheet[key].children[second].bodyTitle}`
        }
      }
    }
    if (mainItem.type === accountType) {
      newListBalanceSheet[key].children = listChild
      newListBalanceSheet[key].bodyTitle = `Jumlah ${newListBalanceSheet[key].bodyTitle}`
    }
  }

  return newListBalanceSheet
}
