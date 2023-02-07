import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, summary, paymentMethod, user, storeInfo }) => {
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
            text: 'LAPORAN JURNAL',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 762, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'TANGGAL', style: 'tableHeader' },
      { text: 'ORDER NUMBER', style: 'tableHeader' },
      { text: 'TIPE', style: 'tableHeader' },
      { text: 'AMOUNT', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1

    paymentMethod.map((record) => {
      let row = []
      console.log('summary', summary[`${record.typeCode}`])

      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: record.method || '-', alignment: 'center' })
      row.push({ text: summary[`${record.typeCode}`] || '0', alignment: 'center' })
      body.push(row)
      return record
    })

    let totalRow = []
    totalRow.push({ text: '-', alignment: 'center' })
    totalRow.push({ text: '-', alignment: 'center' })
    totalRow.push({ text: '-', alignment: 'center' })
    totalRow.push({ text: 'TOTAL' || '-', alignment: 'center' })
    totalRow.push({ text: summary.total || '0', alignment: 'center' })
    body.push(totalRow)

    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center' })
        row.push({ text: (tableBody[key].createdAt ? moment(tableBody[key].createdAt).format('DD MMM YYYY') : '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].number || (tableBody[key]['returnOrder.number'])).toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].method || '-').toString(), alignment: 'center' })
        row.push({ text: (tableBody[key].total || '0').toString(), alignment: 'center', color: tableBody[key].type === 'RTN' ? '#FF0000' : '#000000' })
        body.push(row)
      }
      count += 1
    }
    return body
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

  let tableBody = []
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['5%', '15%', '45%', '12%', '13%', '10%'],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 130, 40, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    data: dataSource,
    header,
    footer
  }

  console.log('pdfProps', pdfProps)

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
