/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'
import reduce from 'lodash/reduce'

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate }) => {
  let width = []
  const group = (data, key) => {
    return reduce(data, (group, item) => {
      (group[item[key]] = group[item[key]] || []).push(item)
      return group
    }, [])
  }

  const groubedByTeam = group(listTrans, 'policeNoId')
  let listData = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  // Declare Function
  const createTableBody = (tabledata) => {
    // Declare Variable
    const headerData = ['NO', 'DATE', 'WO NO', 'TRANSNO', 'CATEGORY', 'VALUE']
    const headers = [
      headerData.map(string => ({ fontSize: 12, text: string, style: 'tableHeader', alignment: 'center' }))
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
          { text: moment(data.transDate, 'YYYY-MM-DD').format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: data.woNo, alignment: 'left', fontSize: 11 },
          { text: data.transNo, alignment: 'left', fontSize: 11 },
          { text: data.categoryName, alignment: 'left', fontSize: 11 },
          { text: data.valueName, alignment: 'left', fontSize: 11 }
        ]
        body.push(row)
      }
      counter += 1
    }
    // const totalRowData = [
    //   '',
    //   formatNumberIndonesia(qtyUnit),
    //   formatNumberIndonesia(serviceTotal),
    //   formatNumberIndonesia(productTotal),
    //   formatNumberIndonesia(counterTotal),
    //   formatNumberIndonesia(parseFloat(productTotal) + parseFloat(serviceTotal) + parseFloat(counterTotal))
    // ]
    // let totalRow = ([{ text: 'Grand Total', colSpan: 2, alignment: 'center', fontSize: 12 }]).concat(totalRowData.map(string => ({ text: string, alignment: 'right', fontSize: 12 })))
    width.push(['4%', '16%', '20%', '20%', '20%', '20%'])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let key in listData) {
    try {
      tableBody.push(createTableBody(listData[key]))
      tableTitle.push({ text: `${listData[key][0].memberCode} - ${listData[key][0].memberName} (${listData[key][0].policeNo})`, style: 'tableTitle' })
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
            text: 'LAPORAN WORK ORDER',
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
                text: `PERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left',
                render: text => `${moment(text).format('LL ')}`
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
      margin: [0, 10, 0, 8],
      bold: true
    }
  }

  // Declare additional Props
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
    data: listData
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired
}

export default PrintPDF
