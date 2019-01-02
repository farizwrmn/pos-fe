import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo, name }) => {
  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'DAFTAR UNIT CUSTOMER',
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
    const tableHeaderList = [
      'NO',
      'NO PLAT',
      'MEREK',
      'MODEL',
      'TYPE',
      'TAHUN',
      'NO RANGKA',
      'NO MESIN'
    ]

    const header = [
      tableHeaderList.map(header => ({ text: header, style: 'tableHeader' }))
    ]

    // return tableData.map((data, index) => {

    //   return datalist.map(dataMapList => ({ text: dataMapList, alignment: 'left' }))
    // })

    return header.concat(
      tableBody.map((data, index) => {
        const datalist = [
          index + 1,
          data.policeNo,
          data.merk,
          data.model,
          data.type,
          data.year,
          data.chassisNo,
          data.machineNo
        ]
        return datalist.map(dataMapList => ({ text: dataMapList, alignment: 'left' }))
      })
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
  console.log('dataSource', dataSource)

  const pdfProps = {
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    name,
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: (dataSource || [])
      .filter(memberDetail => memberDetail.memberUnit.length > 0)
      .map(() => (['6%', '14%', '12%', '12%', '12%', '12%', '16%', '16%'])),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [15, 90, 15, 60],
    tableTitle: (dataSource || [])
      .filter(memberDetail => memberDetail.memberUnit.length > 0)
      .map(memberDetail => ({ text: `Member : ${memberDetail.memberCode} - ${memberDetail.memberName}`, style: 'tableTitle' })),
    tableBody: (dataSource || [])
      .filter(memberDetail => memberDetail.memberUnit.length > 0)
      .map(memberDetail => createTableBody(memberDetail.memberUnit)),
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
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  data: PropTypes.object
}

export default PrintPDF
