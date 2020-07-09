/**
 * Created by Veirry on 07/07/2020.
 */
import React from 'react'
import moment from 'moment'
import { numberFormat } from 'utils'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listTrans, storeInfo, from, to }) => {
  let width = []
  let outJSON = listTrans

  let groupBy = (xs) => {
    return xs
      .reduce((prev, next) => {
        if (next.cost) {
          (prev[next.cost.bankId] = prev[next.cost.bankId] || []).push(next)
          return prev
        }
        (prev.cash = prev.cash || []).push(next)
        return prev
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

  let groubedByTeam = groupBy(outJSON, 'cost.costBank.bankName')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  const createTableBody = (tabledata) => {
    const headers = [
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'NO_FAKTUR', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'CASHIER', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'APPROVE BY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'OPTION', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'EDC', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'CHARGE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'AMOUNT', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'MEMO', style: 'tableHeader', alignment: 'center' }
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
          { text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: data.pos.transNo, alignment: 'left', fontSize: 11 },
          { text: data.balance.balanceUser.fullName, alignment: 'left', fontSize: 11 },
          { text: data.balance && data.balance.balanceApprove ? data.balance.balanceApprove.fullName : '-', alignment: 'left', fontSize: 11 },
          { text: data.paymentOption && data.paymentOption.typeName ? data.paymentOption.typeName : 'CASH', alignment: 'left', fontSize: 11 },
          { text: data.cost && data.cost.costMachine ? data.cost.costMachine.name : 'CASH', alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.chargeTotal || 0)), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.amount) || 0), alignment: 'right', fontSize: 11 },
          { text: data.description || '-', alignment: 'left', fontSize: 11 }
        ]
        body.push(row)
      }
      counter += 1
    }

    const chargeTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.chargeTotal) || 0), 0)
    const amountTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.amount) || 0), 0)

    let totalRow = [
      { text: 'Total', colSpan: 7, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      {},
      {},
      { text: formatNumberIndonesia(chargeTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(amountTotal), alignment: 'right', fontSize: 12 },
      {}
    ]
    body.push(totalRow)

    width.push([
      '4%',
      '10%',
      '10%',
      '10%',
      '10%',
      '10%',
      '10%',
      '10%',
      '10%',
      '15%',
      '15%'
    ])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i][0]
    try {
      tableBody.push(createTableBody(arr[i]))
      if (item.cost) {
        tableTitle.push({ text: `Bank : ${item.cost.costBank.bankName}`, style: 'tableTitle' })
      } else {
        tableTitle.push({ text: 'CASH', style: 'tableTitle' })
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
            text: 'LAPORAN PEMBAYARAN DETAIL',
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
  listTrans: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
