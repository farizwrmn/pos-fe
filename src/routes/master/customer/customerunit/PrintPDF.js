import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, dataCustomer, user, storeInfo }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    title: {
      fontSize: 12,
      alignment: 'left',
      margin: [0, 5, 0, 0]
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
            text: 'LAPORAN DAFTAR UNIT CUSTOMER',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 762, y2: 5, lineWidth: 0.5 }]
          },
          {
            text: `${dataCustomer.memberName}(${dataCustomer.memberCode})`,
            style: 'title'
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'NO PLAT', style: 'tableHeader' },
      { text: 'MEREK', style: 'tableHeader' },
      { text: 'MODEL', style: 'tableHeader' },
      { text: 'TIPE', style: 'tableHeader' },
      { text: 'TAHUN', style: 'tableHeader' },
      { text: 'NO RANGKA', style: 'tableHeader' },
      { text: 'NO MESIN', style: 'tableHeader' }
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
        row.push({ text: (data.policeNo || '').toString(), alignment: 'left' })
        row.push({ text: (data.merk || '').toString(), alignment: 'left' })
        row.push({ text: (data.model || '').toString(), alignment: 'left' })
        row.push({ text: (data.type || '').toString(), alignment: 'left' })
        row.push({ text: (data.year || '').toString(), alignment: 'left' })
        row.push({ text: (data.chassisNo || '').toString(), alignment: 'left' })
        row.push({ text: (data.machineNo || '').toString(), alignment: 'left' })
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
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 762, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['6%', '14%', '12%', '12%', '12%', '12%', '16%', '16%'],
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
