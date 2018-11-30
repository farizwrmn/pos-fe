import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'
import { formatNumbering } from 'utils'

const PrintPDF = ({ user, listData, storeInfo, fromDate, toDate }) => {
  listData = listData.filter(x => x.items.length > 0)
  let width = []
  const styles = {
    header: {
      alignment: 'center',
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: 'black',
      alignment: 'center'
    },
    rowTextFooter: {
      alignment: 'center',
      fontSize: 12,
      bold: true
    },
    rowNumberFooter: {
      alignment: 'right',
      fontSize: 12,
      bold: true
    },
    footer: {
      fontSize: 9
    }
  }

  const createTableBody = (tabledata) => {
    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = tabledata.reduce((cnt, o) => cnt + ((o.sellPrice - o.sellingPrice > 0 ? o.sellPrice : o.sellingPrice || 0) * o.qty), 0)
    let totalDiscount4 = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountLoyalty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discountLoyalty) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + o.totalDiscount, 0)
    let totalAfterDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    const diffData = tabledata.reduce((group, item) => {
      (group[item.typeCode] = group[item.typeCode] || []).push(item)
      return group
    }, [])

    let body = []
    for (let key in diffData) {
      let headers = []
      switch (key) {
        case 'P':
          headers.push(
            [
              { text: 'NO', style: 'tableHeader' },
              { text: 'KODE PRODUK', style: 'tableHeader' },
              { text: 'NAMA PRODUK', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'HARGA SATUAN', style: 'tableHeader' },
              { text: 'SUB TOTAL', style: 'tableHeader' },
              { text: 'DISK-1', style: 'tableHeader' },
              { text: 'DISK-2', style: 'tableHeader' },
              { text: 'DISK-3', style: 'tableHeader' },
              { text: 'DISKON', style: 'tableHeader' },
              { text: 'LOYALTY', style: 'tableHeader' },
              { text: 'TOTAL DISKON', style: 'tableHeader' },
              { text: 'TOTAL', style: 'tableHeader' }
            ]
          )
          break
        case 'S':
          headers.push(
            [
              { text: 'NO', style: 'tableHeader' },
              { text: 'KODE SERVIS', style: 'tableHeader' },
              { text: 'NAMA SERVIS', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'HARGA SATUAN', style: 'tableHeader' },
              { text: 'SUB TOTAL', style: 'tableHeader' },
              { text: 'DISK-1', style: 'tableHeader' },
              { text: 'DISK-2', style: 'tableHeader' },
              { text: 'DISK-3', style: 'tableHeader' },
              { text: 'DISKON', style: 'tableHeader' },
              { text: 'LOYALTY', style: 'tableHeader' },
              { text: 'TOTAL DISKON', style: 'tableHeader' },
              { text: 'TOTAL', style: 'tableHeader' }
            ]
          )
          break
        default:
      }
      for (let i = 0; i < headers.length; i += 1) {
        body.push(headers[i])
      }
      const rows = diffData[key]
      let counter = 1
      for (let key in rows) {
        if (rows.hasOwnProperty(key)) {
          let data = rows[key]
          const sellingPrice = (data.sellPrice - data.sellingPrice > 0 ? data.sellPrice : data.sellingPrice)
          let row = [
            { text: counter, alignment: 'center', fontSize: 11 },
            { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 },
            { text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 },
            { text: (data.qty || 0), alignment: 'center', fontSize: 11 },
            { text: formatNumbering(sellingPrice), alignment: 'right', fontSize: 11 },
            { text: formatNumbering((sellingPrice) * data.qty), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.disc1), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.disc2), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.disc3), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.discount), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.discountLoyalty), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.totalDiscount), alignment: 'right', fontSize: 11 },
            { text: formatNumbering(data.netto), alignment: 'right', fontSize: 11 }
          ]
          body.push(row)
        }
        counter += 1
      }
    }

    let totalRow = [
      { text: 'Total', colSpan: 3, style: 'rowTextFooter' },
      {},
      {},
      { text: formatNumbering(totalQty), style: 'rowNumberFooter' },
      {},
      { text: formatNumbering(totalSubTotal), style: 'rowNumberFooter' },
      {},
      {},
      {},
      { text: formatNumbering(totalDiscount4), style: 'rowNumberFooter' },
      { text: formatNumbering(totalDiscountLoyalty), style: 'rowNumberFooter' },
      { text: formatNumbering(totalDiscount), style: 'rowNumberFooter' },
      { text: formatNumbering(totalAfterDiscount), style: 'rowNumberFooter' }
    ]
    body.push(totalRow)
    width.push(['2%', '12%', '16%', '4%', '8%', '8%', '6%', '6%', '6%', '8%', '8%', '8%', '8%'])
    return body
  }

  let tableTitle = []
  let tableBody = []
  for (let i = 0; i < listData.length; i += 1) {
    try {
      tableTitle.push(
        {
          table: {
            widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
            body: [
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{ text: 'NO TRANSAKSI', fontSize: 11 }, ':', { text: (listData[i].transNo || '').toString(), fontSize: 11 }, {}, { text: 'NO PLAT/KM', fontSize: 11 }, ':', { text: `${(listData[i].policeNo || '').toString()}${(listData[i].policeNo && listData[i].lastMeter) ? '/' : ''}${(listData[i].lastMeter || '').toString()}`, fontSize: 11 }],
              [{ text: 'TANGGAL', fontSize: 11 }, ':', { text: moment(listData[i].transDate).format('DD-MMM-YYYY'), fontSize: 11 }, {}, { text: 'MEREK/MODEL', fontSize: 11 }, ':', { text: `${(listData[i].merk || '').toString()}${(listData[i].merk && listData[i].model) ? '/' : ''}${(listData[i].model || '').toString()}`, fontSize: 11 }],
              [{ text: 'ID ANGGOTA', fontSize: 11 }, ':', { text: (listData[i].memberCode || '').toString(), fontSize: 11 }, {}, { text: 'TIPE/TAHUN', fontSize: 11 }, ':', { text: `${(listData[i].type || '').toString()}${(listData[i].type && listData[i].year) ? '/' : ''}${(listData[i].year || '').toString()}`, fontSize: 11 }],
              [{ text: 'NAMA ANGGOTA', fontSize: 11 }, ':', { text: (listData[i].memberName || '').toString(), fontSize: 11 }, {}, { text: 'MEKANIK', fontSize: 11 }, ':', { text: (listData[i].technicianName || '').toString(), fontSize: 11 }]
            ]
          },
          layout: 'noBorders'
        }
      )
      tableBody.push(createTableBody(listData[i].items))
    } catch (e) {
      console.log(e)
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
            text: 'LAPORAN HISTORY POS DETAIL',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1151, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                alignment: 'center'
              },
              {
                text: '',
                alignment: 'right'
              }
            ]
          }
        ]
      }
    ],
    margin: [20, 40, 20, 30]
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [20, 30, 20, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1151, y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              style: 'footer',
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              style: 'footer',
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              style: 'footer',
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A3',
    pageOrientation: 'landscape',
    width,
    pageMargins: [20, 130, 20, 60],
    header,
    tableTitle,
    tableBody,
    footer,
    tableStyle: styles,
    data: listData
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listData: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
