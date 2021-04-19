/**
 * Created by Veirry on 07/07/2020.
 */
import React from 'react'
import moment from 'moment'
import { lstorage, numberFormat } from 'utils'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({
  user,
  listSalesCategory,
  listStockByCategory,
  storeInfo,
  from,
  to
}) => {
  let width = []
  let outJSON = listSalesCategory
  const listUserStores = lstorage.getListUserStores()

  let groupBy = (xs, key) => {
    return xs
      .reduce((prev, next) => {
        (prev[next[key]] = prev[next[key]] || []).push(next)
        return prev
      }, {})
  }

  // let groupBy = (xs) => {
  //   return xs
  //     .reduce((prev, next) => {
  //       if (next.cost) {
  //         (prev[next.machine] = prev[next.machine] || []).push(next)
  //         return prev
  //       }
  //       (prev.cash = prev.cash || []).push(next)
  //       return prev
  //     }, {})
  // }

  let groubedByTeam = groupBy(outJSON, 'storeId')
  let groubedForStock = groupBy(listStockByCategory.filter(filtered => filtered.count), 'storeId')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
  let arrStock = Object.keys(groubedForStock).map(index => groubedForStock[index])
  const reMapTotal = [
    {
      active: 1,
      amount: listStockByCategory
        .filter(filtered => filtered.count)
        .reduce((prev, next) => prev + next.amount, 0),
      count: listStockByCategory
        .filter(filtered => filtered.count)
        .reduce((prev, next) => prev + next.count, 0),
      name: 'total',
      productCode: 'V748-P0057',
      productName: '',
      sellPrice: 0
    }
  ]

  let groubedForStockTotal = groupBy(reMapTotal, 'name')
  let arrReMapTotal = Object.keys(groubedForStockTotal).map(index => groubedForStockTotal[index])

  arr = arr
    .concat(arrStock)
    .concat(arrReMapTotal)


  const createTableBody = (tabledata) => {
    const isDaily = tabledata && tabledata[0] && tabledata[0].productCode
    let headers = [
      [
        { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' }
      ]
    ]
    if (isDaily) {
      headers = [
        [
          { fontSize: 12, text: 'NAMA BARANG', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'HARGA JUAL', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'COGS', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
        ]
      ]
    }

    const rows = tabledata
    let body = headers
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: data.categoryName, alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.netto || 0)), alignment: 'right', fontSize: 11 },
          { text: '', alignment: 'left', fontSize: 11 }
        ]
        if (isDaily && data.name) {
          row = [
            { text: '', alignment: 'left', fontSize: 11 },
            { text: '', alignment: 'right', fontSize: 11 },
            { text: '', alignment: 'right', fontSize: 11 },
            { text: '', alignment: 'right', fontSize: 11 },
            { text: '', alignment: 'right', fontSize: 11 }
          ]
        } else if (isDaily && !data.name) {
          const cogs = parseFloat(data.amount) / parseFloat(data.count)
          const difference = parseFloat(data.sellPrice) - parseFloat(cogs)
          const margin = Math.round((difference / parseFloat(data.sellPrice)) * 100)
          row = [
            { text: data.productName, alignment: 'left', fontSize: 11 },
            { text: `${margin > 0 ? `(${margin}%) ` : ''}${formatNumberIndonesia(parseFloat(data.sellPrice || 0))}`, alignment: 'right', fontSize: 11 },
            { text: formatNumberIndonesia(parseFloat(data.count || 0)), alignment: 'right', fontSize: 11 },
            { text: formatNumberIndonesia(parseFloat(data.amount) / parseFloat(data.count)), alignment: 'right', fontSize: 11 },
            { text: formatNumberIndonesia(parseFloat(data.amount || 0)), alignment: 'right', fontSize: 11 }
          ]
        }
        body.push(row)
      }
    }

    const amountTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let totalRow = [
      { text: 'Total', bold: true, alignment: 'left', fontSize: 12 },
      { text: formatNumberIndonesia(amountTotal), bold: true, alignment: 'right', fontSize: 12 },
      { text: '', bold: true, alignment: 'right', fontSize: 12 }
    ]
    if (isDaily) {
      const qtyTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.count) || 0), 0)
      const amountTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.amount) || 0), 0)
      totalRow = [
        { text: 'Total', colSpan: 2, bold: true, alignment: 'left', fontSize: 12 },
        { text: '', bold: true, alignment: 'left', fontSize: 12 },
        { text: formatNumberIndonesia(qtyTotal), bold: true, alignment: 'right', fontSize: 12 },
        { text: '', bold: true, alignment: 'left', fontSize: 12 },
        { text: formatNumberIndonesia(amountTotal), bold: true, alignment: 'right', fontSize: 12 }
      ]
    }
    body.push(totalRow)

    if (isDaily) {
      width.push([
        '46%',
        '16%',
        '11%',
        '11%',
        '16%'
      ])
    } else {
      width.push([
        '20%',
        '15%',
        '65%'
      ])
    }
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i][0]
    try {
      tableBody.push(createTableBody(arr[i]))
      const filterStore = listUserStores ? listUserStores.filter(filtered => filtered.value === item.storeId) : []
      const isDaily = item.productCode
      if (filterStore && filterStore[0]) {
        if (isDaily) {
          tableTitle.push({ text: `UPDATE STOCK: \n${filterStore[0].label}`, bold: true, style: 'tableTitle' })
        } else {
          tableTitle.push({ text: filterStore[0].label, bold: true, style: 'tableTitle' })
        }
      } else if (isDaily) {
        tableTitle.push({ text: 'TOTAL SELURUH TOKO', bold: true, style: 'tableTitle' })
      } else {
        tableTitle.push({ text: 'UNKNOWN STORE', style: 'tableTitle' })
      }
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
            text: 'LAPORAN OMSET DAN STOK',
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
                text: `\nPERIODE: ${moment(from).format('DD-MMM-YYYY')}  TO  ${moment(to).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'center'
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
    className: 'button-width02 button-extra-large bgcolor-red',
    pageSize: 'A4',
    pageOrientation: 'landscape',
    width,
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorders',
    footer,
    tableStyle: styles,
    data: arr
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
