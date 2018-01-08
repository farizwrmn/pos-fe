import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
  let tableHeaders = {
    top: {
      col_1: { text: 'SERVICE CODE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
      col_2: { text: 'SERVICE NAME', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
      col_3: { text: 'COST', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
      col_4: { text: 'SERVICE COST', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
      col_5: { text: 'SERVICE TYPE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
    },
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
        row.push({ text: (tableBody[key].serviceCode || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].serviceName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].cost || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].serviceCost || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].serviceTypeId || '').toString(), alignment: 'left' })
        body.push(row)
      }
    }
    return body
  }
  const styles = {
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
    headerStoreName: {
      fontSize: 18,
      margin: [45, 10, 0, 0],
    },
    headerTitle: {
      fontSize: 16,
      margin: [45, 2, 0, 0],
    },
  }

  const header = [
    { text: `${storeInfo.name}`, style: 'headerStoreName' },
    { text: 'LAPORAN DAFTAR SERVIS', style: 'headerTitle' },
  ]

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 732, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }],
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left',
            },
            {
              text: `Dicetak Oleh: ${user.userid}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'center',
            },
            {
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
        },
      ],
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
    width: ['20%', '32%', '14%', '20%', '14%'],
    pageSize: { width: 813, height: 530 },
    pageOrientation: 'landscape',
    pageMargins: [40, 80, 40, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    data: dataSource,
    header,
    footer,
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  dataSource: PropTypes.object,
}

export default PrintPDF
