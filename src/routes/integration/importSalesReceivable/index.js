/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import {
  Button, message, Modal
} from 'antd'
import { routerRedux } from 'dva/router'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import List from './List'

const ImportSalesReceivable = ({
  loading,
  dispatch,
  importSalesReceivable
}) => {
  const { list, pagination } = importSalesReceivable
  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importSalesReceivable/query'] || loading.effects['importSalesReceivable/execute'] || loading.effects['importSalesReceivable/add'] || loading.effects['importSalesReceivable/bulkInsert'],
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
              type: 'importSalesReceivable/bulkInsert',
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
          type: 'importSalesReceivable/execute'
        })
      }
    })
  }

  const handleCancel = () => {
    Modal.confirm({
      title: 'Do you want to cancel this list ?',
      onOk () {
        dispatch({
          type: 'importSalesReceivable/cancel'
        })
      }
    })
  }

  const handleProduct = () => {

  }

  return (
    <div className="content-inner">
      <div>
        <span>
          {'Product: '}
          <Button type="default" onClick={() => handleProduct()}>Product</Button>
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

      <List {...listProps} />
      <span
        style={{ textAlign: 'right', marginTop: '15px' }}
      >
        <Button
          style={{ marginRight: '15px' }}
          type="danger"
          onClick={handleCancel}
          disabled={loading.effects['importSalesReceivable/execute'] || loading.effects['importSalesReceivable/cancel'] || loading.effects['importSalesReceivable/add'] || loading.effects['importSalesReceivable/bulkInsert']}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleExecute}
          disabled={loading.effects['importSalesReceivable/execute'] || loading.effects['importSalesReceivable/cancel'] || loading.effects['importSalesReceivable/add'] || loading.effects['importSalesReceivable/bulkInsert']}
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
    importSalesReceivable,
    app
  }) => ({
    loading,
    importSalesReceivable,
    app
  })
)(ImportSalesReceivable)
