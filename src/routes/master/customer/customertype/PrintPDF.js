import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
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
    { text: 'LAPORAN DAFTAR TIPE CUSTOMER', style: 'headerTitle' }
  ]

  let tableHeaders = {
    top: {
      col_1: { text: 'KODE', style: 'tableHeader', alignment: 'center' },
      col_2: { text: 'TIPE CUSTOMER', style: 'tableHeader', alignment: 'center' },
      col_3: { text: 'DISC-1', style: 'tableHeader', alignment: 'center' },
      col_4: { text: 'DISC-2', style: 'tableHeader', alignment: 'center' },
      col_5: { text: 'DISC-3', style: 'tableHeader', alignment: 'center' },
      col_6: { text: 'DISC(NOMINAL)', style: 'tableHeader', alignment: 'center' },
      col_7: { text: 'KATEGORI', style: 'tableHeader', alignment: 'center' }
    }
  }

  const createTableHeader = (tableHeader) => {
    let head = []
    for (let key in tableHeader) {
      if (tableHeader.hasOwnProperty(key)) {
        let data = tableHeader[key]
        let row = []
        row.push(data.col_1)
        row.push(data.col_2)
        row.push(data.col_3)
        row.push(data.col_4)
        row.push(data.col_5)
        row.push(data.col_6)
        row.push(data.col_7)
        head.push(row)
      }
    }
    return head
  }

  const createTableBody = (tableData) => {
    let body = []
    for (let key in tableData) {
      if (tableData.hasOwnProperty(key)) {
        let data = tableData[key]
        let row = []
        row.push({ text: (data.typeCode || '').toString(), alignment: 'center' })
        row.push({ text: (data.typeName || '').toString(), alignment: 'center' })
        row.push({ text: (data.discPct01 || '').toString(), alignment: 'center' })
        row.push({ text: (data.discPct02 || '').toString(), alignment: 'center' })
        row.push({ text: (data.discPct03 || '').toString(), alignment: 'center' })
        row.push({ text: (data.discNominal || '').toString(), alignment: 'center' })
        row.push({ text: (data.sellPrice || '').toString(), alignment: 'center' })
        body.push(row)
      }
    }
    return body
  }

  let tableBody = []
  let tableHeader = []
  try {
    tableBody = createTableBody(dataSource)
    tableHeader = createTableHeader(tableHeaders)
  } catch (e) {
    console.log(e)
  }

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

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['14%', '24%', '10%', '10%', '10%', '16%', '16%'],
    pageSize: { width: 813, height: 530 },
    pageOrientation: 'landscape',
    pageMargins: [40, 80, 40, 60],
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
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  dataSource: PropTypes.object
}

export default PrintPDF
