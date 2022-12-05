import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

export const createTableBodyBrowse = (tabledata, bodyStruct) => {
  let finalDataSource = []
  let allTotal = 0
  for (let key in bodyStruct) {
    let grandTotal = 0
    let dataSource = []
    const item = bodyStruct[key]
    let browseParent = {}
    if (item.accountName) {
      let total = item.debit ? (item.debit * -1) : item.credit || 0
      browseParent = {
        key: item.accountName,
        accountName: (item.accountName || '').toString(),
        value: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
      }
      dataSource.push({
        key: item.accountName,
        accountName: (item.accountName || '').toString(),
        value: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
      })
    } else {
      browseParent = {
        key: item.bodyTitle,
        accountName: (item.bodyTitle || '').toString(),
        value: 0
      }
    }
    if (item.child) {
      const { dataSource: dataSourceChild, total } = createTableBodyBrowse(tabledata, item.child)
      if (browseParent && browseParent.accountName) {
        browseParent.value = total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
        browseParent.children = dataSourceChild
        dataSource.push(browseParent)
      }
      grandTotal += total
      dataSource = dataSource.concat(dataSourceChild)
    }
    if (item.type) {
      const accountData = tabledata[item.type]
      const total = accountData.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
      const { dataSource: dataSourceChild } = createTableBodyBrowse(tabledata, accountData)
      browseParent.children = dataSourceChild
      browseParent.value = total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
      grandTotal += parseFloat(total || 0)
      dataSource = dataSource.concat(browseParent)
    }
    allTotal += parseFloat(grandTotal)
    finalDataSource = finalDataSource.concat(dataSource)
  }

  return { dataSource: finalDataSource, total: allTotal }
}

export const createTableBody = (tabledata, bodyStruct) => {
  let groupBody = []
  let grandTotal = 0
  for (let key in bodyStruct) {
    const item = bodyStruct[key]
    const depth = 15 * (item.level != null ? item.level : 3)
    if (item.accountName) {
      let total = item.debit ? (item.debit * -1) : item.credit || 0
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.accountName || '').toString(), margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
    } else {
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.bodyTitle || '').toString(), margin: [depth, 0, 0, 0], style: 'tableHeader', alignment: 'left', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
    }
    if (item.child) {
      const { data, total } = createTableBody(tabledata, item.child)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.totalTitle || '').toString(), style: 'tableFooter', margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
      grandTotal += total
    }
    if (item.type) {
      const accountData = tabledata[item.type]
      const total = accountData.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
      const { data } = createTableBody(tabledata, accountData)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.totalTitle || '').toString(), style: 'tableFooter', margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
      grandTotal += parseFloat(total || 0)
    }
  }

  return { data: groupBody, total: grandTotal }
}

export const createTableBodyProfit = (tabledata, {
  groupCompare,
  type,
  bodyTitle,
  totalTitle
}) => {
  let groupBody = []
  let dataBody = []
  let dataSource = []
  const rows = tabledata[type]
  groupBody.push([
    { text: '', alignment: 'right', fontSize: 11 },
    { text: bodyTitle, style: 'tableHeader', alignment: 'left', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 }
  ])
  for (let key in rows) {
    if (rows.hasOwnProperty(key)) {
      let item = rows[key]
      const total = item.debit ? (item.debit * -1) : item.credit || 0
      let row = [
        { text: '', alignment: 'left', fontSize: 11 },
        { text: `${item.accountCode} - ${item.accountName}`, alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ]
      groupBody.push(row)
      dataBody.push({
        key: item.accountCode,
        accountName: `${item.accountCode} - ${item.accountName}`,
        value: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
      })
    }
  }
  let totalCompare = 0
  if (groupCompare) {
    const rowsCompare = groupCompare[type]
    for (let key in rowsCompare) {
      if (rowsCompare.hasOwnProperty(key)) {
        let item = rowsCompare[key]
        const filteredRow = dataBody.filter(filtered => filtered.key === item.accountCode)
        const total = item.debit ? (item.debit * -1) : item.credit || 0
        if (filteredRow && filteredRow.length > 0) {
          dataBody = dataBody.map((body) => {
            if (body.key === item.accountCode) {
              body.compare = total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
            }
            return body
          })
        } else {
          dataBody.push({
            key: item.accountCode,
            accountName: `${item.accountCode} - ${item.accountName}`,
            compare: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`
          })
        }
      }
    }
    totalCompare = rowsCompare.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  }

  const total = rows.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  groupBody.push([
    { text: '', alignment: 'left', fontSize: 11 },
    { text: totalTitle, style: 'tableFooter', alignment: 'left', fontSize: 11 },
    { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'left', fontSize: 11 }
  ])
  dataSource.push({
    key: bodyTitle,
    accountName: bodyTitle,
    value: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`,
    compare: totalCompare >= 0 ? formatNumberIndonesia(totalCompare) : `(${formatNumberIndonesia(totalCompare * -1)})`,
    children: dataBody
  })
  return { dataSource, total, totalCompare, groupBody }
}
