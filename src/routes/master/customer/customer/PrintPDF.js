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
            text: 'LAPORAN DAFTAR CUSTOMER',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 947, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [25, 12, 25, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'ID', style: 'tableHeader' },
      { text: 'NAME', style: 'tableHeader' },
      { text: 'BIRTHDATE', style: 'tableHeader' },
      { text: 'ADDRESS', style: 'tableHeader' },
      { text: 'CITY', style: 'tableHeader' },
      { text: 'PHONE NO', style: 'tableHeader' },
      { text: 'MOBILE NO', style: 'tableHeader' },
      { text: 'TYPE', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableData) => {
    let body = []
    let count = 1
    for (let key in tableData) {
      if (tableData.hasOwnProperty(key)) {
        let data = tableData[key]
        let row = []
        row.push({ text: count, alignment: 'center', style: 'tableBody' })
        row.push({ text: (data.memberCode || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.memberName || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: moment(data.birthDate).format('DD-MMM-YYYY'), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.address01 || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.cityName || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.phoneNumber || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.mobileNumber || '').toString(), alignment: 'left', style: 'tableBody' })
        row.push({ text: (data.memberTypeName || '').toString(), alignment: 'left', style: 'tableBody' })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  let tableBody = []
  try {
    tableBody = createTableBody(data)
  } catch (e) {
    console.log(e)
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [25, 30, 25, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 947, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    className: '',
    name,
    buttonStyle: { background: 'transparent', padding: 0 },
    width: ['4%', '10%', '15%', '8%', '24%', '7%', '10%', '10%', '11%'],
    pageSize: { width: 1000, height: 700 },
    pageOrientation: 'landscape',
    pageMargins: [25, 140, 25, 60],
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
  data: PropTypes.object
}

export default PrintPDF
