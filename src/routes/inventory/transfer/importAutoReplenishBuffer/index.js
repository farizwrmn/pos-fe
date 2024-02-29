/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import {
  Button, Icon, message, Form, Select, Row, Col
} from 'antd'
import { routerRedux } from 'dva/router'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { lstorage } from 'utils'
import List from './List'
import PrintXLS from './PrintXLS'
import PrintXLSDownloadData from './PrintXLSDownloadData'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const ImportAutoReplenishBuffer = ({
  location,
  loading,
  dispatch,
  importAutoReplenishBuffer,
  productbrand,
  productcategory,
  productstock,
  transferOut,
  form: {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    validateFields
  },
  app
}) => {
  const { listStore } = transferOut
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { list, listAutoReplenish, pagination } = importAutoReplenishBuffer
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
    validateFields((errors) => {
      if (errors) {
        return
      }
      const getData = {
        ...getFieldsValue()
      }

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
                const dimensionBox = row.values[5]
                const bufferQty = row.values[6]
                const minDisplay = row.values[7]
                if (rowIndex >= 6
                  && typeof productId !== 'undefined'
                  && typeof bufferQty !== 'undefined'
                  && typeof minDisplay !== 'undefined'
                  && typeof dimensionBox !== 'undefined'
                ) {
                  const data = {
                    storeId: getData.storeIdReceiver,
                    productId: Number(productId),
                    dimensionBox: Number(dimensionBox),
                    bufferQty: Number(bufferQty),
                    minDisplay: Number(minDisplay)
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
                  storeId: getData.storeIdReceiver,
                  detail: uploadData
                }
              })
            } else {
              message.error('No Data to Upload')
            }
          })
      }
    })
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/inventory/transfer/auto-replenish'))
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

  let childrenStoreReceived = []
  if (listStore.length > 0) {
    let groupStore = []
    for (let id = 0; id < listStore.length; id += 1) {
      groupStore.push(
        <Option disabled={Number(lstorage.getCurrentUserStore()) === listStore[id].value || getFieldValue('storeIdReceiver') === listStore[id].value} value={listStore[id].value}>
          {listStore[id].label}
        </Option>
      )
    }
    childrenStoreReceived.push(groupStore)
  }

  const getDownloadData = (storeId) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (!storeId) {
        message.error('Pick store')
        return
      }
      dispatch({
        type: 'importAutoReplenishBuffer/downloadData',
        payload: {
          storeId
        }
      })
    })
  }

  const onChooseStore = (storeId) => {
    dispatch({
      type: 'importAutoReplenishBuffer/updateState',
      payload: {
        listAutoReplenish: []
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        page: 1,
        storeId
      }
    }))
  }

  return (
    <div className="content-inner">
      <Button type="primary" style={{ marginBottom: '10px' }} icon="rollback" onClick={() => BackToList()}>Back</Button>

      <Row>
        <Col sm={24} md={12} lg={8}>
          <Form layout="horizontal">
            <FormItem label="To Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeIdReceiver', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                onSelect={event => onChooseStore(event)}
                filterOption={filterOption}
              >
                {childrenStoreReceived}
              </Select>)}
            </FormItem>
          </Form>
        </Col>
      </Row>

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

      <div>
        <Button
          type="default"
          disabled={loading.effects['importAutoReplenishBuffer/downloadData']}
          size="large"
          onClick={() => getDownloadData(location.query.storeId)}
          loading={loading.effects['importAutoReplenishBuffer/downloadData']}
        >
          <Icon type="download" />Download Data
        </Button>
        {listAutoReplenish && listAutoReplenish.length > 0 ? <PrintXLSDownloadData listAutoReplenish={listAutoReplenish} /> : null}
      </div>
      <br />
    </div>
  )
}

export default connect(
  ({
    loading,
    transferOut,
    importAutoReplenishBuffer,
    productstock,
    productbrand,
    productcategory,
    app
  }) => ({
    loading,
    transferOut,
    importAutoReplenishBuffer,
    productstock,
    productbrand,
    productcategory,
    app
  })
)(Form.create()(ImportAutoReplenishBuffer))
