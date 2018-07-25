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
            text: 'LAPORAN DAFTAR STOK BARANG',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 970, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [15, 12, 15, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'ID', style: 'tableHeader' },
      { text: 'NAMA', style: 'tableHeader' },
      { text: 'MEREK', style: 'tableHeader' },
      { text: 'KATEGORI', style: 'tableHeader' },
      { text: 'ASPEK RASIO', style: 'tableHeader' },
      { text: 'HARGA JUAL', style: 'tableHeader' },
      { text: 'HARGA POKOK', style: 'tableHeader' },
      { text: 'HARGA DIST-1', style: 'tableHeader' },
      { text: 'HARGA DIST-2', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let counter = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: counter.toString(), alignment: 'center' })
        row.push({ text: (tableBody[key].productCode || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].productName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].brandName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].categoryName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].aspectRatio || '0').toString(), alignment: 'right' })
        row.push({ text: (tableBody[key].sellPrice || 0).toLocaleString(), alignment: 'right' })
        row.push({ text: (tableBody[key].costPrice || 0).toLocaleString(), alignment: 'right' })
        row.push({ text: (tableBody[key].distPrice01 || 0).toLocaleString(), alignment: 'right' })
        row.push({ text: (tableBody[key].distPrice02 || 0).toLocaleString(), alignment: 'right' })
        body.push(row)
      }
      counter += 1
    }
    return body
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [15, 30, 15, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 970, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    name,
    className: '',
    width: ['3%', '12%', '22%', '15%', '9%', '7%', '7%', '8%', '8%', '8%'],
    pageSize: { width: 1000, height: 530 },
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
