import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'

const PrintPDF = ({ dataSource, user, selectedVendor, dateRange }) => {
  const header = {
    stack: [
      {
        stack: [
          {
            text: 'LAPORAN PENJUALAN',
            style: 'header'
          },
          {
            text: dateRange && dateRange.length > 0 ? `Tanggal: ${moment(dateRange[0]).format('DD MMMM YYYY')} - ${moment(dateRange[1]).format('DD MMMM YYYY')}` : ''
          },
          {
            text: selectedVendor && selectedVendor.id ? `Vendor: ${selectedVendor.vendor_code} - ${selectedVendor.name}` : ''
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 762, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const createTableBody = (tableBody, summary) => {
    const tableHeader = [
      [
        { text: 'NO', style: 'tableHeader' },
        { text: 'TANGGAL', style: 'tableHeader' },
        { text: 'FAKTUR PENJUALAN', style: 'tableHeader' },
        { text: 'PAYMENT', style: 'tableHeader' },
        { text: 'TOTAL', style: 'tableHeader' },
        { text: 'KOMISI', style: 'tableHeader' },
        { text: 'CHARGE', style: 'tableHeader' },
        { text: 'GRAB', style: 'tableHeader' },
        { text: 'MODAL', style: 'tableHeader' },
        { text: 'PROFIT', style: 'tableHeader' }
      ]
    ]
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: (tableBody[key].createdAt ? moment(tableBody[key].createdAt).format('DD MMM YYYY') : '').toString(), alignment: 'center', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({
          text: `${tableBody[key]['salesOrder.number'] || tableBody[key]['returnOrder.number']}
        Produk: ${tableBody[key]['stock.product.product_name'] || tableBody[key]['salesOrderProduct.stock.product.product_name']}
        Qty: ${tableBody[key].quantity || 0}`,
          alignment: 'left',
          color: tableBody[key].type === 'rtn' ? 'red' : 'black'
        })
        row.push({ text: (tableBody[key]['salesOrder.paymentMethods.method'] || tableBody[key]['returnOrder.salesOrder.paymentMethods.method']).toString(), alignment: 'center', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${Number(tableBody[key].total || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${Number(tableBody[key].commission || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${Number(tableBody[key].charge || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${Number(tableBody[key].commissionGrab || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${(Number(tableBody[key]['stock.product.capital'] || Number(tableBody[key]['salesOrderProduct.stock.product.capital'])) || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        row.push({ text: `Rp ${Number(tableBody[key].profit || 0).toLocaleString()}`, alignment: 'right', color: tableBody[key].type === 'rtn' ? 'red' : 'black' })
        body.push(row)
      }
      count += 1
    }
    let row = []
    if (summary !== null) {
      row.push({ text: '', alignment: 'center' })
      row.push({ text: '', alignment: 'center' })
      row.push({ text: '', alignment: 'center' })
      row.push({ text: 'TOTAL', alignment: 'left' })
      row.push({ text: `Rp ${Number(summary.subTotal || 0).toLocaleString()}`, alignment: 'right' })
      row.push({ text: `Rp ${Number(summary.commission || 0).toLocaleString()}`, alignment: 'right' })
      row.push({ text: `Rp ${Number(summary.charge || 0).toLocaleString()}`, alignment: 'right' })
      row.push({ text: `Rp ${Number(summary.grab || 0).toLocaleString()}`, alignment: 'right' })
      row.push({ text: `Rp ${Number(summary.capital || 0).toLocaleString()}`, alignment: 'right' })
      row.push({ text: `Rp ${Number(summary.profit || 0).toLocaleString()}`, alignment: 'right' })
      body.push(row)
    }
    return tableHeader.concat(body)
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
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    className: '',
    name: 'Pdf',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: (dataSource || [])
      .filter(filtered => filtered.list.length > 0)
      .map(() => (['4%', '12%', '20%', '10%', '9%', '9%', '9%', '9%', '9%', '9%'])),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [15, 90, 15, 60],
    tableTitle: (dataSource || [])
      .filter(filtered => filtered.list.length > 0)
      .map(filtered => ({ text: `Vendor : ${filtered.vendor.vendor_code} - ${filtered.vendor.name}`, style: 'tableTitle' })),
    tableBody: (dataSource || [])
      .filter(filtered => filtered.list.length > 0)
      .map(filtered => createTableBody(filtered.list, filtered.summary)),
    data: dataSource,
    dataSource,
    header,
    footer
  }


  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  dataSource: PropTypes.object
}

export default PrintPDF
