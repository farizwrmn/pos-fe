import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

// Declare Function
export const createTableBody = (tabledata, {
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
