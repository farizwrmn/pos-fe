/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import moment from 'moment'
import { numberFormat } from 'utils'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const getLinkName = (transNo, transType) => {
  switch (transType) {
    case 'FJ':
      return `${window.location.origin}/accounts/payment/${encodeURIComponent(transNo)}`
    case 'FB':
      return `${window.location.origin}/accounts/payable/${encodeURIComponent(transNo)}`
    default:
      return undefined
  }
}

const PrintPDF = ({ user, listRekap, storeInfo, period, year }) => {
  let width = []
  let outJSON = listRekap

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

  let groubedByTeam = groupBy(outJSON, 'productCode')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  const createTableBody = (tabledata) => {
    let inQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pQty) || 0), 0)
    let inAmount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pAmount) || 0), 0)
    let outQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sQty) || 0), 0)
    let outAmount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sAmount) || 0), 0)
    const headers = [
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'CREATED', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'NO_FAKTUR', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TIPE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'MASUK', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'HARGA SATUAN', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'KELUAR', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'HARGA SATUAN', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'HARGA JUAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'JUMLAH', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
      ]
    ]

    const rows = tabledata
    let body = headers
    let countQtyValue = 0
    let countAmountValue = 0
    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        countAmountValue = ((parseFloat(countAmountValue) || 0) + (parseFloat(data.sAmount) || 0)) - (parseFloat(data.sAmount) || 0)
        let row = [
          { text: counter, alignment: 'center', fontSize: 11 },
          { text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: moment(data.createdAt).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: (data.transNo || '').toString(), link: getLinkName(data.transNo, data.transType), decoration: getLinkName(data.transNo, data.transType) ? 'underline' : undefined, alignment: 'left', fontSize: 11 },
          { text: data.transType.toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.pQty) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.pPrice) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.pAmount) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.sQty) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.sPrice) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.sValue) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.sAmount) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(countQtyValue), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia((parseFloat(data.pAmount) || 0) - (parseFloat(data.sAmount) || 0)), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      counter += 1
    }

    let totalRow = [
      { text: 'Total', colSpan: 5, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      { text: formatNumberIndonesia(inQty), alignment: 'right', fontSize: 12 },
      {},
      { text: formatNumberIndonesia(inAmount), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(outQty), alignment: 'right', fontSize: 12 },
      {},
      {},
      { text: formatNumberIndonesia(outAmount), alignment: 'right', fontSize: 12 },
      {},
      { text: formatNumberIndonesia((inAmount - outAmount)), alignment: 'right', fontSize: 12 }
    ]
    body.push(totalRow)
    width.push(['4%', '7%', '7%', '11%', '4%', '5%', '9%', '9%', '5%', '9%', '9%', '9%', '5%', '9%'])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    try {
      tableBody.push(createTableBody(arr[i]))
      tableTitle.push({ text: `Produk : ${arr[i][0].productCode} - ${arr[i][0].productName}`, style: 'tableTitle' })
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
            text: 'LAPORAN KARTU STOK FIFO',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(period, 'MM').format('MMMM').concat('-', year)}`,
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1080, y2: -8, lineWidth: 0.5 }]
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
    pageSize: 'A3',
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
  listRekap: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
