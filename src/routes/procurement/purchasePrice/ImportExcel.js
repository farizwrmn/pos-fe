/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { Button, Icon, message } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import PrintXLS from './PrintXLS'

const ImportExcel = ({
  dispatch,
  listUom,
  user,
  storeInfo,
  changed,
  stockLoading,
  listPrintAllStock
}) => {
  const printProps = {
    user,
    storeInfo
  }

  const getAllStock = () => {
    dispatch({
      type: 'productstock/queryAllStock',
      payload: {
        pageSize: 1
      }
    })
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
              const storeId = row.values[4]
              const purchasePrice = row.values[5]
              const discPercent = row.values[6]
              const discPercent02 = row.values[7]
              const discPercent03 = row.values[8]
              const discNominal = row.values[9]
              const taxType = row.values[10]
              console.log('row.values', row.values)
              if (rowIndex >= 6
                && typeof productId !== 'undefined'
                && typeof supplierId !== 'undefined'
                && typeof storeId !== 'undefined'
                && typeof purchasePrice !== 'undefined'
                && typeof discPercent !== 'undefined'
                && typeof discPercent02 !== 'undefined'
                && typeof discPercent03 !== 'undefined'
                && typeof discNominal !== 'undefined'
                && typeof taxType !== 'undefined'
              ) {
                const data = {
                  productId: Number(productId),
                  supplierId: Number(supplierId),
                  storeId: Number(storeId),
                  purchasePrice: Number(purchasePrice),
                  discPercent: Number(discPercent),
                  discPercent02: Number(discPercent02),
                  discPercent03: Number(discPercent03),
                  discNominal: Number(discNominal),
                  taxType: taxType || 'E'
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'purchasePrice/add',
              payload: {
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

  let buttonClickXLS = (changed && listPrintAllStock.length)
    ? (<PrintXLS listUom={listUom} data={listPrintAllStock} name="Export Template Product" {...printProps} />)
    : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get Template Stock</Button>)

  return (
    <div>
      {'Stock: '}
      {buttonClickXLS}
      <span>
        <label htmlFor="opname" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Select File</label>
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
    </div>
  )
}

export default ImportExcel
