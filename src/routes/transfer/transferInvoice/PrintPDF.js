import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ data, user, storeInfo, name }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      alignment: 'center'
    },
    tableBody: {
      fontSize: 11
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
            text: 'LAPORAN DAFTAR PENAGIHAN',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 1570, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [15, 12, 15, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'TRANS NO', style: 'tableHeader' },
      { text: 'DATE', style: 'tableHeader' },
      { text: 'RECEIVER', style: 'tableHeader' },
      { text: 'OWING', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'MEMO', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    const body = tableBody.map((list, index) => (
      [
        { text: index + 1, alignment: 'center' },
        { text: (list.transNo || '').toString(), alignment: 'left' },
        { text: (moment(list.transDate).format('DD-MMM-YYYY') || '').toString(), alignment: 'left' },
        { text: (list && list.storeIdReceiverDetail && list.storeIdReceiverDetail.storeName ? list.storeIdReceiverDetail.storeName : '').toString(), alignment: 'left' },
        { text: (list.paymentTotal || '').toLocaleString(), alignment: 'right' },
        { text: (list.netto || 0).toLocaleString(), alignment: 'right' },
        { text: (list.memo || '').toLocaleString(), alignment: 'left' }
      ]
    ))
    return body
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [15, 30, 15, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 1570, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak Oleh: ${user.userid}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
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

  let tableBody = []
  try {
    tableBody = createTableBody(data)
  } catch (e) {
    console.log(e)
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    buttonType: 'default',
    buttonSize: 'large',
    name,
    width: [
      '5%',
      '11%',
      '11%',
      '13%',
      '15%',
      '15%',
      '30%'
    ],
    pageSize: { width: 1200, height: 830 },
    pageOrientation: 'landscape',
    pageMargins: [15, 140, 15, 60],
    tableStyle: styles,
    tableHeader,
    tableBody,
    data,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  data: PropTypes.object
}

export default PrintPDF
