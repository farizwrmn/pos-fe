/**
 * Created by Veirry on 07/07/2020.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

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
  period: {
    name: 'Courier New',
    family: 4,
    size: 12
  },
  tableTitle: {
    name: 'Courier New',
    family: 4,
    size: 12,
    bold: true
  },
  tableTotal: {
    name: 'Courier New',
    family: 4,
    size: 11,
    bold: true
  },
  tableHeader: {
    name: 'Courier New',
    family: 4,
    size: 11,
    bold: true
  },
  tableBody: {
    name: 'Times New Roman',
    family: 4,
    size: 10
  },
  tableFooter: {
    name: 'Times New Roman',
    family: 4,
    size: 10
  },
  tableBorder: {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } }
  }
}

const createTableBody = (tabledata, bodyStruct) => {
  let groupBody = []
  let grandTotal = 0
  for (let key in bodyStruct) {
    const item = bodyStruct[key]
    const depth = ('\t').repeat(0)
    if (item.accountName) {
      groupBody.push([
        { value: `${depth}${item.accountName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: parseFloat(item.debit ? (item.debit * -1) : item.credit || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ])
    } else {
      groupBody.push([
        { value: `${depth}${item.bodyTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder }
      ])
    }
    if (item.child) {
      const { data, total } = createTableBody(tabledata, item.child)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { value: `${depth}${item.totalTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ])
      grandTotal += total
    }
    if (item.type) {
      const accountData = tabledata[item.type]
      const total = accountData.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
      const { data } = createTableBody(tabledata, accountData)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { value: `${depth}${item.totalTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ])
      grandTotal += parseFloat(total || 0)
    }
  }

  return { data: groupBody, total: grandTotal }
}

const PrintXLS = ({ listTrans, storeInfo, fromDate, toDate }) => {
  const title = [
    { value: 'LAPORAN ARUS KAS', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  let tableTitle = []
  let tableBody = []
  let tableFooter = []
  let groupBy = (xs, key) => {
    return xs
      .reduce((prev, next) => {
        (prev[next[key]] = prev[next[key]] || []).push(next)
        return prev
      }, {})
  }
  const groubedByTeam = groupBy(listTrans, 'accountType')

  const group = {
    BANK: [],
    AREC: [],
    INTR: [],
    OCAS: [],

    FASS: [],
    DEPR: [],
    OASS: [],

    APAY: [],
    OCLY: [],
    LTLY: [],

    EQTY: [],
    ...groubedByTeam
  }

  const ProcedureOfList = () => {
    // Start - REVE
    const { data: groupREVEBody } = createTableBody(
      group,
      [
        {
          bodyTitle: 'ASET',
          totalTitle: 'Jumlah Aset',
          level: 0,
          child: [
            {
              bodyTitle: 'ASET LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Lancar',
              child: [
                {
                  type: 'BANK',
                  level: 2,
                  bodyTitle: 'Kas dan Setara Kas',
                  totalTitle: 'Jumlah Kas dan Setara Kas'
                },
                {
                  type: 'AREC',
                  level: 2,
                  bodyTitle: 'Piutang Usaha',
                  totalTitle: 'Jumlah Piutang Usaha'
                },
                {
                  type: 'INTR',
                  level: 2,
                  bodyTitle: 'Persediaan',
                  totalTitle: 'Jumlah Persediaan'
                },
                {
                  type: 'OCAS',
                  level: 2,
                  bodyTitle: 'Aset Lancar Lainnya',
                  totalTitle: 'Jumlah Aset Lancar Lainnya'
                }
              ]
            },
            {
              bodyTitle: 'ASET TIDAK LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Tidak Lancar',
              child: [
                {
                  type: 'FASS',
                  level: 2,
                  bodyTitle: 'Nilai Histori',
                  totalTitle: 'Jumlah Nilai Histori'
                },
                {
                  type: 'DEPR',
                  level: 2,
                  bodyTitle: 'Akumulasi Penyusutan',
                  totalTitle: 'Jumlah Akumulasi Penyusutan'
                }
              ]
            }
          ]
        },
        {
          bodyTitle: 'KEWAJIBAN DAN EKUITAS',
          totalTitle: 'Jumlah Kewajiban dan Ekuitas',
          level: 0,
          child: [
            {
              bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
              level: 1,
              totalTitle: 'Jumlah Kewajiban Jangka Pendek',
              child: [
                {
                  type: 'APAY',
                  level: 2,
                  bodyTitle: 'Hutang Usaha',
                  totalTitle: 'Jumlah Hutang Usaha'
                },
                {
                  type: 'OCLY',
                  level: 2,
                  bodyTitle: 'Kewajiban Jangka Pendek Lainnya',
                  totalTitle: 'Jumlah Kewajiban Jangka Pendek Lainnya'
                }
              ]
            },
            {
              type: 'LTLY',
              level: 1,
              bodyTitle: 'Kewajiban Jangka Panjang',
              totalTitle: 'Jumlah Kewajiban Jangka Panjang'
            },
            {
              type: 'EQTY',
              level: 1,
              bodyTitle: 'Ekuitas',
              totalTitle: 'Jumlah Ekuitas'
            }
          ]
        }
      ])
    tableBody.push(groupREVEBody)
    // End - REVE
  }

  try {
    ProcedureOfList()
  } catch (error) {
    console.log('error', error)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle,
    tableBody,
    tableFooter,
    data: listTrans,
    fileName: 'Accounting-Detail-Summary'
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.object,
  storeInfo: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
}

export default PrintXLS
