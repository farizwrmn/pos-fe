import React from 'react'
import { BasicExcelReport } from 'components'

const SimpleExcelTemplate = () => {
  const styles = {
    tableHeader: {
      name: 'Calibri',
      family: 4,
      size: 11,
      bold: true
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    }
  }

  const title = [
    { value: 'PRICE TAG IMPORT TEMPLATE', alignment: { vertical: 'middle', horizontal: 'center' } }
  ]

  const tableHeader = [
    [
      { value: 'No.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Product Code', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  const tableBody = [
    [
      { value: '', border: styles.tableBorder },
      { value: '', border: styles.tableBorder }
    ],
    [
      { value: '1.', border: styles.tableBorder },
      { value: 'EXAMPLE001', border: styles.tableBorder }
    ],
    [
      { value: '', border: styles.tableBorder },
      { value: '', border: styles.tableBorder }
    ]
  ]

  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    title,
    tableHeader,
    tableBody,
    fileName: 'product_codes_template'
  }

  return <BasicExcelReport {...XLSProps} />
}

export default SimpleExcelTemplate
