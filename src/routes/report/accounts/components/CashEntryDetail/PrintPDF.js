import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'
import { formatNumberIndonesia, formatDate } from 'utils'

const PrintPDF = ({ user, listDetail, storeInfo, from, to }) => {
  let width = []
  let outJSON = listDetail

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }

  // const unique = (group, code) => {
  //   return group.map((key) => {
  //     return key[code]
  //   }).filter((e, index, array) => {
  //     return index === array.indexOf(e)
  //   })
  // }
  // const groupCode = unique(outJSON, 'productCode')
  // let groups = []
  // groupCode.map((code) => {
  //   groups.push(outJSON.filter(group => group.productCode === code))
  //   return code
  // })

  let groubedByTeam = groupBy(outJSON, 'transNoId')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  const createTableBody = (tabledata) => {
    let amountIn = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.amountIn) || 0), 0)
    let amountOut = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.amountOut) || 0), 0)
    const headers = [
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'KODE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'NAMA', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'DESCRIPTION', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'DEBIT', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'KREDIT', style: 'tableHeader', alignment: 'center' }
      ]
    ]

    const rows = tabledata
    let body = headers
    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: counter, alignment: 'center', fontSize: 11 },
          { text: (data.accountDetailCode || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.accountName || ''), alignment: 'left', fontSize: 11 },
          { text: (data.description || ''), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.amountIn || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.amountOut || 0), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      counter += 1
    }

    let totalRow = [
      { text: 'Total', colSpan: 4, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      { text: `${(amountIn).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(amountOut).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
    ]
    body.push(totalRow)
    width.push(['5%', '11%', '23%', '23%', '19%', '19%'])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    try {
      tableBody.push(createTableBody(arr[i]))
      tableTitle.push(
        {
          table: {
            widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
            body: [
              [{ text: 'Invoice No' }, ':', { text: (arr[i][0].transNo || '').toString() }, {}, { text: 'Invoice Date' }, ':', { text: formatDate(arr[i][0].transDate) }],
              [{ text: 'Pembayaran' }, ':', { text: (arr[i][0].typeName || '').toString() }, {}, { text: 'Reference' }, ':', { text: (arr[i][0].reference || '') }]
            ]
          },
          style: 'tableTitle',
          layout: 'noBorders'
        }
      )
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
            text: 'LAPORAN DETAIL CASH',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${formatDate(from, 'YYYY-MM-DD')} to ${formatDate(to, 'YYYY-MM-DD')}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'right'
              }
            ]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
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
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A4',
    pageOrientation: 'landscape',
    width,
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorder',
    footer,
    tableStyle: styles,
    data: arr
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listDetail: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
