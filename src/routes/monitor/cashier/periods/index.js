import React from 'react'
import { connect } from 'dva'
import { CashRegister } from 'components'
import { Row, Col, Button, Form, Select, Icon, DatePicker } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 9 }
  }
}

const leftColumn = {
  xs: 24,
  sm: 16,
  md: 16,
  lg: 16,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8
}

const History = ({
  cashier,
  store,
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
    validateFields
  }
}) => {
  const { list, listCashier, listCashRegister, modalVisible, searchText, pagination, cashierInfo } = cashier
  const { listCashierStore } = store

  let stores = []
  if (listCashierStore && listCashierStore.length) {
    stores = listCashierStore.map(x => (<Option value={x.id}>{x.storeName}</Option>))
  }

  const modalProps = {
    listCashier,
    searchText,
    pagination,
    loading,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    onSearch () {
      dispatch({
        type: 'cashier/getCashRegisterByStore',
        payload: {
          page: 1,
          params: { cashierId: '', storeId: '', from: '', to: '' }
        }
      })
    },
    onReset () {
      dispatch({
        type: 'cashier/query'
      })
      dispatch({
        type: 'cashier/updateState',
        payload: {
          searchText: ''
        }
      })
    },
    onClickRow (record) {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          cashierInfo: record,
          modalVisible: false
        }
      })
      resetFields()
    },
    changeText (text) {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          searchText: text
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'cashier/query',
        payload: {
          q: searchText,
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  const openModal = () => {
    dispatch({
      type: 'cashier/updateState',
      payload: {
        modalVisible: true,
        listCashier: list
      }
    })
  }

  const showStores = () => {
    dispatch({
      type: 'store/getAllStores',
      payload: {
        mode: 'cashier',
        cashier: cashierInfo.cashierId
      }
    })
  }

  const showCashRegister = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let item = { ...getFieldsValue() }
      item.cashierId = cashierInfo.cashierId
      dispatch({
        type: 'cashier/getCashRegisterByStore',
        payload: {
          item
        }
      })
    })
  }

  const cashRegisterProps = {
    listCashRegister
  }

  let buttonName = 'Find Cashier'
  if (cashierInfo.cashierId) {
    let name = cashierInfo.cashierId
    buttonName = name
    if (name.length > 17) {
      buttonName = `${name.slice(0, 17)}...`
    }
  }

  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Row>
        <Col {...leftColumn}>
          <FormItem label="Cashier Id" hasFeedback {...formItemLayout}>
            <Button type="primary" size="large" onClick={openModal} style={{ width: '100%' }}>{buttonName}</Button>
          </FormItem>
          <FormItem label="Store Id"
            help="Store based on the cashier..."
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('storeId', {
              initialValue: '',
              rules: [{ required: true }]
            })(<Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select Store"
              optionFilterProp="children"
              onFocus={showStores}
            >{stores}
            </Select>)}
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: ''
            })(<Select defaultValue="" style={{ width: '100%' }}>
              <Option value="O">Open</Option>
              <Option value="C">Close</Option>
              <Option value="R" disabled>Request</Option>
              <Option value="V" disabled>Verify</Option>
              <Option value="">All Status</Option>
            </Select>)}
          </FormItem>
          <FormItem label="Period" {...formItemLayout} >
            {getFieldDecorator('periods', {})(<RangePicker size="large"
              // onChange={value => handleChangeDate(value)}
              format="DD-MMM-YYYY"
              style={{ width: '100%' }}
            />
            )}
          </FormItem>
        </Col>
        <Col {...rightColumn} style={{ textAlign: 'right' }}>
          <Button
            type="dashed"
            size="large"
            style={{ marginLeft: '5px' }}
            className="button-width02 button-extra-large"
            onClick={() => showCashRegister()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
        </Col>
      </Row>
      <div className="reminder">
        <CashRegister {...cashRegisterProps} />
      </div>
    </div >
  )
}

export default connect(({ cashier, store, loading }) => ({ cashier, store, loading }))(Form.create()(History))
