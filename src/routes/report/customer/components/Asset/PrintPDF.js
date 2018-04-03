import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listAsset, storeInfo }) => {
  const group = (data, key) => {
    return _.reduce(data, (group, item) => {
      (group[item[key]] = group[item[key]] || []).push(item)
      return group
    }, [])
  }

  const listData = group(listAsset, 'memberCode')

  const createTableBody = (tabledata) => {
    let subTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.grandTotal) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let total = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.nettoTotal) || 0), 0)
    const headers = [
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'NO PLAT', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'SUB TOTAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
      ]
    ]

    const rows = tabledata
    let body = []
    for (let i = 0; i < headers.length; i += 1) {
      body.push(headers[i])
    }

    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: counter, alignment: 'center', fontSize: 11 })
        row.push({ text: data.policeNo.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (parseFloat(data.grandTotal) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.totalDiscount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.nettoTotal) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      counter += 1
    }

    let totalRow = []
    totalRow.push({ text: 'Total', colSpan: 2, style: 'rowTextFooter' })
    totalRow.push({})
    totalRow.push({ text: `${subTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({ text: `${totalDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({ text: `${total.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    body.push(totalRow)
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let key in listData) {
    try {
      tableBody.push(createTableBody(listData[key]))
      tableTitle.push({ text: `${key} - ${listData[key][0].memberName}`, style: 'tableTitle' })
    } catch (e) {
      console.log(e)
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN ASET PELANGGAN',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [50, 12, 50, 30]
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [50, 30, 50, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 820 - (2 * 40), y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black'
    },
    tableTitle: {
      fontSize: 14,
      margin: [0, 20, 0, 8]
    },
    rowTextFooter: {
      alignment: 'center',
      fontSize: 12,
      bold: true
    },
    rowNumberFooter: {
      alignment: 'right',
      fontSize: 12,
      bold: true
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A4',
    pageOrientation: 'landscape',
    width: ['5%', '20%', '25%', '25%', '25%'],
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorder',
    footer,
    tableStyle: styles,
    data: Object.keys(listData)
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listAsset: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
