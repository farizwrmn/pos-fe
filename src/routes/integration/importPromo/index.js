/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import {
  message
} from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import ProductXLS from './ProductXLS'

const ImportStock = ({
  dispatch,
  productbrand,
  productcategory,
  app
}) => {
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { user, storeInfo } = app
  const printProps = {
    user,
    storeInfo,
    listBrand,
    listCategory
  }

  const uploadProps = {
    name: 'file',
    processData: false
  }

  const handleImportProduct = (event) => {
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
              let startPoint = 3
              const productCode = row.values[++startPoint]
              const productName = row.values[++startPoint]
              const barCode01 = row.values[++startPoint]
              const sellPrice = row.values[++startPoint]
              const distPrice01 = row.values[++startPoint]
              const distPrice02 = row.values[++startPoint]
              const distPrice03 = row.values[++startPoint]
              const distPrice04 = row.values[++startPoint]
              const distPrice05 = row.values[++startPoint]
              const distPrice06 = row.values[++startPoint]
              const distPrice07 = row.values[++startPoint]
              const distPrice08 = row.values[++startPoint]
              const distPrice09 = row.values[++startPoint]
              const brandId = row.values[++startPoint]
              const categoryId = row.values[++startPoint]
              const trackQty = row.values[++startPoint]
              const alertQty = row.values[++startPoint]
              if (rowIndex >= 7) {
                const data = {
                  productCode,
                  productName,
                  barCode01,
                  sellPrice,
                  distPrice01,
                  distPrice02,
                  distPrice03,
                  distPrice04,
                  distPrice05,
                  distPrice06,
                  distPrice07,
                  distPrice08,
                  distPrice09,
                  brandName: brandId,
                  categoryName: categoryId,
                  trackQty,
                  alertQty
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'importstock/bulkInsert',
              payload: uploadData
            })
          } else {
            message.error('No Data to Upload')
          }
        })
    }
  }

  return (
    <div className="content-inner">
      <span>
        {'Target: '}
        <ProductXLS data={[]} name="Export Template Target" {...printProps} />
        <label
          htmlFor="uploadProduct"
          className="ant-btn ant-btn-primary ant-btn-lg"
          style={{
            padding: '0.5em',
            marginLeft: '15px'
          }}
        >
          Select File
        </label>
        <input
          type="file"
          style={{
            visibility: 'hidden'
          }}
          className="ant-btn ant-btn-default ant-btn-lg"
          {...uploadProps}
          id="uploadProduct"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          {...uploadProps}
          onClick={(event) => {
            event.target.value = null
          }}
          onInput={(event) => {
            handleImportProduct(event)
          }}
        />
      </span>
    </div>
  )
}

export default connect(
  ({
    loading,
    importstock,
    productstock,
    productbrand,
    productcategory,
    app
  }) => ({
    loading,
    importstock,
    productstock,
    productbrand,
    productcategory,
    app
  })
)(ImportStock)
