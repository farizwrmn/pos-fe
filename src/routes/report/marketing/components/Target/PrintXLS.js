/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, fromDate, toDate, from = moment(fromDate, 'M').format('MMMM'), to = moment(toDate, 'M').format('MMMM'), storeInfo }) => {
  const styles = {
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
    },
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    date: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 11
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    },
    tableFooter: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    }
  }

  const customStyle = {
    count: {
      alignment: { vertical: 'middle', horizontal: 'right' },
      font: styles.tableBody,
      border: styles.tableBorder
    },
    data: {
      alignment: { vertical: 'middle', horizontal: 'left' },
      font: styles.tableBody,
      border: styles.tableBorder
    }
  }

  const createTableBody = (list) => {
    let body = []
    const rows = list
    let start = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { value: start, ...customStyle.count },
          { value: '.', ...customStyle.data },
          { value: data.categoryName, ...customStyle.data },

          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },

          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },

          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },

          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count },
          { value: 0, ...customStyle.count }
        ]
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN TARGET PENUALAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${from}  TO  ${to}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  ]

  const tableHeader1 = [
    'NO.',
    '',
    'CATEGORY/BRAND',
    '',
    'UNIT ENTRY',
    '',
    '',
    'QTY',
    '',
    '',
    'SALES',
    '',
    '',
    'GPM',
    ''
  ]
  const tableHeader2 = [
    '',
    '',
    '',
    'YTD',
    from,
    to,
    'YTD',
    from,
    to,
    'YTD',
    from,
    to,
    'YTD',
    from,
    to
  ]

  const tableHeader = [
    tableHeader1.map(x => ({ value: x, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder })),
    tableHeader2.map(x => ({ value: x, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }))
  ]

  let tableBody
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    data: listTrans,
    title,
    tableHeader,
    tableBody,
    fileName: 'POS-Summary'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listTrans: PropTypes.array,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  storeInfo: PropTypes.object
}

export default PrintXLS
