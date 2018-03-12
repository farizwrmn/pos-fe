import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
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
            text: 'LAPORAN DAFTAR TIPE PELANGGAN',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 760, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'TYPE CODE', style: 'tableHeader' },
      { text: 'TYPE NAME', style: 'tableHeader' },
      { text: 'DISC-1', style: 'tableHeader' },
      { text: 'DISC-2', style: 'tableHeader' },
      { text: 'DISC-3', style: 'tableHeader' },
      { text: 'DISC(NOMINAL)', style: 'tableHeader' },
      { text: 'CATEGORY', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableData) => {
    let body = []
    let count = 1
    for (let key in tableData) {
      if (tableData.hasOwnProperty(key)) {
        let data = tableData[key]
        let row = []
        row.push({ text: count, alignment: 'center' })
        row.push({ text: (data.typeCode || '').toString(), alignment: 'left' })
        row.push({ text: (data.typeName || '').toString(), alignment: 'left' })
        row.push({ text: parseFloat(data.discPct01 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' })
        row.push({ text: parseFloat(data.discPct02 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' })
        row.push({ text: parseFloat(data.discPct03 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' })
        row.push({ text: parseFloat(data.discNominal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' })
        row.push({ text: (data.sellPrice || '').toString(), alignment: 'left' })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  let tableBody = []
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 760, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
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

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['6%', '10%', '22%', '10%', '10%', '10%', '16%', '16%'],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 130, 40, 60],
    tableStyle: styles,
    tableHeader,
    tableBody,
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
  dataSource: PropTypes.object
}

export default PrintPDF
