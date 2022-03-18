/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import {
  Button, Icon, message, Modal
} from 'antd'
import { routerRedux } from 'dva/router'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import List from './List'
import PrintXLS from './PrintXLS'
import ProductXLS from './ProductXLS'

const ImportStock = ({
  loading,
  dispatch,
  importstock,
  productbrand,
  productcategory,
  productstock,
  app
}) => {
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { list, pagination } = importstock
  const { user, storeInfo } = app
  const {
    changed,
    listPrintAllStock,
    stockLoading
  } = productstock
  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importstock/query'] || loading.effects['importstock/execute'] || loading.effects['importstock/add'] || loading.effects['importstock/bulkInsert'],
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

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

  const getAllStock = () => {
    dispatch({
      type: 'productstock/queryAllStock',
      payload: {
        type: 'all'
      }
    })
  }


  let buttonClickXLS = (changed && listPrintAllStock.length)
    ? (<PrintXLS data={listPrintAllStock} name="Export Template Stock" {...printProps} />)
    : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get Template Stock</Button>)

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
              const productId = row.values[4]
              const qty = row.values[18]
              const price = row.values[19]
              if (rowIndex >= 7 && typeof productId !== 'undefined' && typeof qty !== 'undefined' && typeof price !== 'undefined' && Number(price) > 0) {
                const data = {
                  productId: Number(productId),
                  qty: Number(qty),
                  price: Number(price)
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'importstock/add',
              payload: {
                detail: uploadData
              }
            })
          } else {
            message.error('No Data to Upload')
          }
        })
    }
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

  const handleExecute = () => {
    Modal.confirm({
      title: 'Do you want to execute this list ?',
      onOk () {
        dispatch({
          type: 'importstock/execute'
        })
      }
    })
  }

  const handleCancel = () => {
    Modal.confirm({
      title: 'Do you want to cancel this list ?',
      onOk () {
        dispatch({
          type: 'importstock/cancel'
        })
      }
    })
  }

  return (
    <div className="content-inner">
      <div>
        <span>
          {'Product: '}
          <ProductXLS data={[]} name="Export Template Product" {...printProps} />
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
      <List {...listProps} />
      <span
        style={{ textAlign: 'right', marginTop: '15px' }}
      >
        <Button
          style={{ marginRight: '15px' }}
          type="danger"
          onClick={handleCancel}
          disabled={loading.effects['importstock/execute'] || loading.effects['importstock/cancel'] || loading.effects['importstock/add'] || loading.effects['importstock/bulkInsert']}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleExecute}
          disabled={loading.effects['importstock/execute'] || loading.effects['importstock/cancel'] || loading.effects['importstock/add'] || loading.effects['importstock/bulkInsert']}
        >
          Execute
        </Button>
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
