import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'

const PrintPDF = ({ data, user, storeInfo, name }) => {
  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'DAFTAR SPESIFIKASI BARANG',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 842 - 30, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [15, 12, 15, 30]
  }

  const createTableBody = (tableBody) => {
    let header = [
      [
        { text: 'NO', style: 'tableHeader' },
        { text: 'CATEGORY CODE', style: 'tableHeader' },
        { text: 'CATEGORY NAME', style: 'tableHeader' },
        { text: 'SPECIFICATION', style: 'tableHeader' },
        { text: 'VALUE', style: 'tableHeader' }
      ]
    ]
    return header.concat(
      tableBody.map((tableBodyData, index) => (
        [
          { text: index + 1, alignment: 'center' },
          { text: tableBodyData.categoryCode || '', alignment: 'left' },
          { text: tableBodyData.categoryName || '', alignment: 'left' },
          { text: tableBodyData.name || '', alignment: 'left' },
          { text: tableBodyData.value, alignment: 'left' }
        ]
      ))
    )
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [15, 30, 15, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 842 - 30, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              style: 'tableFooter',
              alignment: 'left'
            },
            {
              text: `Dicetak Oleh: ${user.userid}`,
              style: 'tableFooter',
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              style: 'tableFooter',
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
    name,
    className: '',
    width: (data || [])
      .filter(productDetail => productDetail.specification.length > 0)
      .map(() => (['4%', '24%', '24%', '24%', '24%'])),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [15, 90, 15, 60],
    tableTitle: (data || [])
      .filter(productDetail => productDetail.specification.length > 0)
      .map(productDetail => ({ text: `Produk : ${productDetail.productCode} - ${productDetail.productName}`, style: 'tableTitle' })),
    tableBody: (data || [])
      .filter(productDetail => productDetail.specification.length > 0)
      .map(productDetail => createTableBody(productDetail.specification)),
    data,
    header,
    footer
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  data: PropTypes.object
}

export default PrintPDF
