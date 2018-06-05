import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listInventoryTransfer, storeInfo, period }) => {
  let qtyTotal = listInventoryTransfer.reduce((cnt, o) => cnt + (o.qty || 0), 0)
  let nettoTotal = listInventoryTransfer.reduce((cnt, o) => cnt + (o.nettoTotal || 0), 0)
  let width = []
  const styles = {
    header: {
      fontSize: 18,
      alignment: 'center',
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
      fontSize: 12,
      margin: [0, 10, 0, 5]
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

  const group = (data, key) => {
    return _.reduce(data, (group, item) => {
      (group[item[key]] = group[item[key]] || []).push(item)
      return group
    }, [])
  }

  const listData = group(listInventoryTransfer, 'transNo')

  const createTableBody = (tabledata) => {
    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let total = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.nettoTotal) || 0), 0)

    const headers = [
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT CODE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT NAME', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'UNIT PRICE', style: 'tableHeader', alignment: 'center' },
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
        let row = [
          { text: counter, alignment: 'center', fontSize: 11 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.qty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.netto || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.nettoTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      counter += 1
    }

    let totalRow = [
      { text: 'Grand Total', colSpan: 3, style: 'rowTextFooter' },
      {},
      {},
      { text: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' },
      {},
      { text: `${total.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' }
    ]
    body.push(totalRow)
    width.push(['6%', '27%', '30%', '8%', '13%', '16%'])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let key in listData) {
    try {
      tableBody.push(createTableBody(listData[key]))
      tableTitle.push({
        table: {
          widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
          body: [
            [{ text: 'Invoice No' }, ':', { text: (listData[key][0].transNo || '').toString() }, {}, { text: 'Invoice Date' }, ':', { text: listData[key][0].transDate ? moment(listData[key][0].transDate).format('DD-MMM-YYYY') : '' }],
            [{ text: 'From' }, ':', { text: (listData[key][0].storeName || '').toString() }, {}, { text: 'Reference' }, ':', { text: (listData[key][0].reference || '').toString() }],
            [{ text: 'To' }, ':', { text: (listData[key][0].storeNameReceiver || '').toString() }, {}, { text: 'Type' }, ':', { text: (listData[key][0].transType || '').toString() }]
          ]
        },
        style: 'tableTitle',
        layout: 'noBorders'
      })
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
            text: 'LAPORAN INVENTORY IN TRANSIT',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
          },
          {
            text: `\nPeriod: ${moment(period).format('MMMM-YYYY')}`,
            fontSize: 10,
            alignment: 'left'
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
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const extra = [
    [
      { text: 'Grand Total', colSpan: 3, style: 'tableHeader', alignment: 'center' },
      {},
      {},
      { text: (qtyTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
      {},
      { text: (nettoTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 }
    ]
  ]
  tableTitle.push({
    table: {
      widths: ['100%'],
      body: [
        [{}],
        [{}],
        [{}],
        [{}]
      ]
    },
    style: 'tableTitle',
    layout: 'noBorders'
  })
  tableBody.push(extra)
  width.push(['6%', '27%', '30%', '8%', '13%', '16%'])

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A4',
    pageOrientation: 'landscape',
    width,
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    footer,
    tableStyle: styles,
    data: Object.keys(listData)
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listInventoryTransfer: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  period: PropTypes.string
}

export default PrintPDF
