import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
  let tableHeaders = {
    top: {
      col_1: { text: 'PRODUCT CODE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_2: { text: 'PRODUCT NAME', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_3: { text: 'MERK', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_4: { text: 'CATEGORY', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_5: { text: 'SELL PRICE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_6: { text: 'COST PRICE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_7: { text: 'DIST PRICE-1', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_8: { text: 'DIST PRICE-2', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      col_9: { text: 'OTHER PRODUCT NAME', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 }
    }
  }

  const createTableHeader = (tableHeader) => {
    let head = []
    for (let key in tableHeader) {
      if (tableHeader.hasOwnProperty(key)) {
        let row = []
        row.push(tableHeader[key].col_1)
        row.push(tableHeader[key].col_2)
        row.push(tableHeader[key].col_3)
        row.push(tableHeader[key].col_4)
        row.push(tableHeader[key].col_5)
        row.push(tableHeader[key].col_6)
        row.push(tableHeader[key].col_7)
        row.push(tableHeader[key].col_8)
        row.push(tableHeader[key].col_9)
        head.push(row)
      }
    }
    return head
  }

  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: (tableBody[key].productCode || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].productName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].brandName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].categoryName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].sellPrice || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].costPrice || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].distPrice01 || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].distPrice02 || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].otherName01 || '').toString(), alignment: 'left' })
        body.push(row)
      }
    }
    return body
  }
  const styles = {
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black'
    },
    headerStoreName: {
      fontSize: 18,
      margin: [45, 10, 0, 0]
    },
    headerTitle: {
      fontSize: 16,
      margin: [45, 2, 0, 0]
    }
  }

  const header = [
    { text: `${storeInfo.name}`, style: 'headerStoreName' },
    { text: 'LAPORAN DAFTAR STOK BARANG', style: 'headerTitle' }
  ]

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 732, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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

  let tableHeader = []
  let tableBody = []
  try {
    tableBody = createTableBody(dataSource)
    tableHeader = createTableHeader(tableHeaders)
  } catch (e) {
    console.log(e)
  }

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['10%', '20%', '8%', '12%', '8%', '8%', '8%', '8%', '18%'],
    pageSize: { width: 1000, height: 530 },
    pageOrientation: 'landscape',
    pageMargins: [15, 80, 15, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    data: dataSource,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  dataSource: PropTypes.object
}

export default PrintPDF
