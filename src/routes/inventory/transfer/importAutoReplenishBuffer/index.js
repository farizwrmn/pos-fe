/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import {
  Button, Icon, message
} from 'antd'
import { routerRedux } from 'dva/router'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import List from './List'
import PrintXLS from './PrintXLS'

const ImportAutoReplenishBuffer = ({
  loading,
  dispatch,
  importAutoReplenishBuffer,
  productbrand,
  productcategory,
  productstock,
  app
}) => {
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { list, pagination } = importAutoReplenishBuffer
  const { user, storeInfo } = app
  const {
    changed,
    listPrintAllStock,
    stockLoading
  } = productstock
  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importAutoReplenishBuffer/query'] || loading.effects['importAutoReplenishBuffer/execute'] || loading.effects['importAutoReplenishBuffer/add'] || loading.effects['importAutoReplenishBuffer/bulkInsert'],
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
              const productId = row.values[2]
              const qty = row.values[5]
              const sortIndex = row.values[6]
              if (rowIndex >= 6 && typeof productId !== 'undefined' && typeof qty !== 'undefined') {
                const data = {
                  productId: Number(productId),
                  qty: Number(qty),
                  sortIndex: Number(sortIndex || 1)
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'importAutoReplenishBuffer/add',
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

  return (
    <div className="content-inner">
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
    </div>
  )
}

export default connect(
  ({
    loading,
    importAutoReplenishBuffer,
    productstock,
    productbrand,
    productcategory,
    app
  }) => ({
    loading,
    importAutoReplenishBuffer,
    productstock,
    productbrand,
    productcategory,
    app
  })
)(ImportAutoReplenishBuffer)
