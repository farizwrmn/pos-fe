import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listData, storeInfo, fromDate, toDate }) => {
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
    let totalQtyPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1Promo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2Promo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3Promo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscountPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItemPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoicePromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPPPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPNPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscountPromo = tabledata.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let totalQtyNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1NonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2NonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3NonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscountNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItemNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoiceNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPPNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPNNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscountNonPromo = tabledata.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1 = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2 = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3 = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItem = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoice = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPP = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPN = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    const diffData = tabledata.reduce((group, item) => {
      (group[item.typeCode] = group[item.typeCode] || []).push(item)
      return group
    }, [])

    let body = []
    for (let key in diffData) {
      let headers = [
        [
          { text: 'NO', style: 'tableHeader' },
          { text: 'KODE PRODUK', style: 'tableHeader' },
          { text: 'NAMA PRODUK', style: 'tableHeader' },
          { text: 'QTY', style: 'tableHeader' },
          { text: 'HARGA SATUAN', style: 'tableHeader' },
          { text: 'DISK-1', style: 'tableHeader' },
          { text: 'DISK-2', style: 'tableHeader' },
          { text: 'DISK-3', style: 'tableHeader' },
          { text: 'DISKON', style: 'tableHeader' },
          { text: 'DISKON BARANG', style: 'tableHeader' },
          { text: 'DISKON FAKTUR', style: 'tableHeader' },
          { text: 'DPP', style: 'tableHeader' },
          { text: 'PPN', style: 'tableHeader' },
          { text: 'TOTAL', style: 'tableHeader' }
        ]
      ]
      for (let i = 0; i < headers.length; i += 1) {
        body.push(headers[i])
      }
      const rows = diffData[key]
      let counter = 1
      for (let key in rows) {
        if (rows.hasOwnProperty(key)) {
          let data = rows[key]
          let row = []
          row.push({ text: counter, alignment: 'center', fontSize: 11 })
          row.push({ text: (data.productCode || ''), alignment: 'left', fontSize: 11 })
          row.push({ text: (data.productName || ''), alignment: 'left', fontSize: 11 })
          row.push({ text: (data.qty || 0), alignment: 'center', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.sellingPrice) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.disc1) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.disc2) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.disc3) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.discount) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.discItem) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.discInvoice) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.DPP) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.PPN) || 0), alignment: 'right', fontSize: 11 })
          row.push({ text: formatNumberIndonesia(parseFloat(data.netto) || 0), alignment: 'right', fontSize: 11 })
          body.push(row)
        }
        counter += 1
      }
    }
    let totalPromoRow = [
      { text: 'Total Promo', colSpan: 3, style: 'rowTextFooter' },
      {},
      {},
      { text: formatNumberIndonesia(totalQtyPromo), style: 'rowNumberFooter' },
      {},
      { text: formatNumberIndonesia(totalDiscount1Promo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount2Promo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount3Promo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountItemPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountInvoicePromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDPPPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalPPNPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalAfterDiscountPromo), style: 'rowNumberFooter' }
    ]
    body.push(totalPromoRow)

    let totalNonPromoRow = [
      { text: 'Total Non Promo', colSpan: 3, style: 'rowTextFooter' },
      {},
      {},
      { text: formatNumberIndonesia(totalQtyNonPromo), style: 'rowNumberFooter' },
      {},
      { text: formatNumberIndonesia(totalDiscount1NonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount2NonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount3NonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountNonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountItemNonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountInvoiceNonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDPPNonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalPPNNonPromo), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalAfterDiscountNonPromo), style: 'rowNumberFooter' }
    ]
    body.push(totalNonPromoRow)

    let totalRow = [
      { text: 'Total', colSpan: 3, style: 'rowTextFooter' },
      {},
      {},
      { text: formatNumberIndonesia(totalQty), style: 'rowNumberFooter' },
      {},
      { text: formatNumberIndonesia(totalDiscount1), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount2), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount3), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscount), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountItem), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDiscountInvoice), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalDPP), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalPPN), style: 'rowNumberFooter' },
      { text: formatNumberIndonesia(totalAfterDiscount), style: 'rowNumberFooter' }
    ]
    body.push(totalRow)
    width.push(['2%', '12%', '20%', '4%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '7%', '7%'])
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
              [{ text: 'NO TRANSAKSI', fontSize: 11 }, ':', { text: (listData[i].transNo || '').toString(), fontSize: 11 }, {}, { text: 'ID ANGGOTA', fontSize: 11 }, ':', { text: (listData[i].memberCode || '').toString(), fontSize: 11 }],
              [{ text: 'TANGGAL', fontSize: 11 }, ':', { text: moment(listData[i].transDate).format('DD-MMM-YYYY'), fontSize: 11 }, {}, { text: 'NAMA ANGGOTA', fontSize: 11 }, ':', { text: (listData[i].memberName || '').toString(), fontSize: 11 }],
              [{ text: 'WAKTU', fontSize: 11 }, ':', { text: listData[i].transTime, fontSize: 11 }, {}, {}, {}, {}]
            ]
          },
          layout: 'noBorders'
        }
      )
      tableBody.push(createTableBody(listData[i].products))
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
            text: 'LAPORAN MARKETING PROMO',
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
    pageMargins: [20, 150, 20, 60],
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
