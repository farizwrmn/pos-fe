import React from 'react'
import { connect } from 'dva'
import {
  Button, Icon, Row, message, Modal, Col
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
  productstock,
  app
}) => {
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
    loading: loading.effects['importstock/query'],
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
    storeInfo
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
    ? (<PrintXLS data={listPrintAllStock} name="Export Template" {...printProps} />)
    : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get Template Data</Button>)

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
              const productId = row.values[3]
              const qty = row.values[11]
              const price = row.values[12]
              if (rowIndex >= 7 && typeof productId !== 'undefined' && typeof qty !== 'undefined' && typeof price !== 'undefined' && Number(qty) > 0 && Number(price) > 0) {
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
              const productCode = row.values[3]
              const productName = row.values[4]
              const barCode01 = row.values[5]
              const sellPrice = row.values[6]
              const distPrice01 = row.values[7]
              const distPrice02 = row.values[8]
              const brandId = row.values[9]
              const categoryId = row.values[10]
              const trackQty = row.values[11]
              const alertQty = row.values[12]
              if (rowIndex >= 7) {
                const data = {
                  productCode,
                  productName,
                  barCode01,
                  sellPrice,
                  distPrice01,
                  distPrice02,
                  brandId: Number(brandId),
                  categoryId: Number(categoryId),
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

  return (
    <div className="content-inner">
      <Row>
        <Col span={12}>
          {buttonClickXLS}
          <input
            type="file"
            className="ant-btn ant-btn-default ant-btn-lg"
            {...uploadProps}
            onChange={handleChangeFile}
          />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <ProductXLS data={[]} name="Export Product Template" {...printProps} />
          <input
            type="file"
            style={{
              float: 'right'
            }}
            className="ant-btn ant-btn-default ant-btn-lg"
            {...uploadProps}
            onChange={handleImportProduct}
          />
        </Col>
      </Row>
      <List {...listProps} />
      <div
        style={{ textAlign: 'right' }}
      >
        <Button
          type="primary"
          onClick={handleExecute}
        >
          Execute
        </Button>
      </div>
    </div>
  )
}

export default connect(
  ({
    loading,
    importstock,
    productstock,
    app
  }) => ({
    loading,
    importstock,
    productstock,
    app
  })
)(ImportStock)
