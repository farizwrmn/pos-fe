/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listPOSCompareSvsI, storeInfo, tableHeader, fromDate, toDate, diffDay, category, brand }) => {
  let brandHeaders = []
  let brandFooters = []
  let width = ['4%', '9%', '9%', '9%', '9%', '9%']
  let eachWidth = '9%'
  if (tableHeader && tableHeader.length > 0) {
    let brandHeader = []
    let brandFooter = []
    eachWidth = `${45 / (tableHeader.length + 1)}%`
    for (let i = 0; i < tableHeader.length; i += 1) {
      brandHeader.push(
        { fontSize: 10, text: tableHeader[i], alignment: 'center' }
      )
      brandFooter.push(
        { text: `${listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o[`brand0${i + 1}`]), 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
      )
    }
    brandHeaders = brandHeader
    brandFooters = brandFooter
  }

  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.sectionWidth || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.aspectRatio || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.rimDiameter || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.salesQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.monthlyTO)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 })
        for (let i = 0; i < tableHeader.length; i += 1) {
          row.push({ text: (data[`brand0${i + 1}`]).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        }
        row.push({ text: data.total.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let qtySoldTotal = 0
  let qtyMonthlyTOTotal = 0
  // let qtyBrand01Total = 0
  // let qtyBrand02Total = 0
  // let qtyBrand03Total = 0
  // let qtyBrand04Total = 0
  let qtyTotal = 0
  if (listPOSCompareSvsI.length > 0) {
    qtySoldTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.salesQty), 0)
    qtyMonthlyTOTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.monthlyTO), 0)
    // qtyBrand01Total = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand01), 0)
    // qtyBrand02Total = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand02), 0)
    // qtyBrand03Total = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand03), 0)
    // qtyBrand04Total = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand04), 0)
    qtyTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
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
            text: 'LAPORAN PENJUALAN - PERSEDIAAN',
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
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 11,
                alignment: 'left'
              },
              {
                stack: [
                  {
                    text: `\nKATEGORY: ${category || 'ALL CATEGORY'}`,
                    fontSize: 11,
                    alignment: 'right'
                  },
                  {
                    text: `\nMERK: ${brand || 'ALL BRAND'}`,
                    fontSize: 11,
                    alignment: 'right'
                  }
                ]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY HH:mm:ss')}`,
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

  const tableHeaders = [
    [
      { fontSize: 12, text: 'NO', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'Section \n Width', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'Aspect \n Ratio', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'Rim \n Diameter', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: `Sold in \n ${diffDay > 0 ? `${diffDay} day${diffDay === 1 ? '' : 's'}` : ''}`, style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'Monthly \n TurnOver', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'Stock in month', style: 'tableHeader', colSpan: brandHeaders.length + 1, alignment: 'center' }
    ],
    [
      {},
      {},
      {},
      {},
      {},
      {},
      { fontSize: 10, text: 'total', alignment: 'center' }
    ]
  ]

  for (let i = 0; i < brandHeaders.length; i += 1) {
    tableHeaders[0].splice(7, 0, {})
    tableHeaders[1].splice(6 + i, 0, brandHeaders[i])
  }

  let tableBody = []
  try {
    tableBody = createTableBody(listPOSCompareSvsI)
  } catch (e) {
    console.log(e)
  }

  const tableFooter = [
    [
      { text: 'Total', colSpan: 4, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      { text: `${qtySoldTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${qtyMonthlyTOTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
    ]
  ]

  for (let i = 0; i < brandFooters.length; i += 1) {
    tableFooter[0].splice(6 + i, 0, brandFooters[i])
  }
  for (let i = 0; i <= tableHeader.length; i += 1) {
    width.splice(6 + i, 0, eachWidth)
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width,
    pageMargins: [50, 145, 50, 60],
    pageSize: 'A3',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader: tableHeaders,
    tableBody,
    tableFooter,
    data: listPOSCompareSvsI,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listPOSCompareSvsI: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
