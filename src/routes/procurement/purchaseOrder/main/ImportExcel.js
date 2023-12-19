/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { message } from 'antd'
import { lstorage } from 'utils'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import PrintXLS from './PrintXLS'

const ImportExcel = ({
  dispatch,
  user,
  storeInfo
}) => {
  const printProps = {
    user,
    storeInfo
  }

  const handleChangeFile = (event) => {
    let uploadData = []
    const fileName = event.target.files[0]
    const workbook = new Excel.Workbook()
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileName)
    reader.onload = () => {
      const buffer = reader.result
      workbook.xlsx.load(buffer)
        .then(async (workbook) => {
          const sheet = workbook.getWorksheet('POS 1')
          await sheet
            .eachRow({ includeEmpty: false }, (row, rowIndex) => {
              const productId = row.values[2]
              const supplierId = row.values[3]
              const groupReference = row.values[4]
              const qty = row.values[5]
              console.log('row.values', row.values)
              if (rowIndex >= 6
                && typeof productId !== 'undefined'
                && typeof supplierId !== 'undefined'
                && typeof groupReference !== 'undefined'
                && typeof qty !== 'undefined'
              ) {
                const data = {
                  productId: Number(productId),
                  supplierId: Number(supplierId),
                  groupReference: Number(groupReference),
                  qty: Number(qty)
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'importPurchaseOrder/add',
              payload: {
                storeId: lstorage.getCurrentUserStore(),
                data: uploadData
              }
            })
          } else {
            message.error('No Data to Upload')
          }
        })
    }
  }

  const uploadProps = {
    name: 'file',
    processData: false
  }

  let buttonClickXLS = (<PrintXLS name="Export Template" {...printProps} />)

  return (
    <span>
      {buttonClickXLS}
      <span>
        <label htmlFor="opname" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Import Excel</label>
        <input
          id="opname"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="ant-btn ant-btn-default ant-btn-lg"
          style={{ visibility: 'hidden' }}
          {...uploadProps}
          onClick={(event) => {
            event.target.value = null
          }}
          onInput={(event) => {
            handleChangeFile(event)
          }}
        />
      </span>
    </span>
  )
}

export default ImportExcel
