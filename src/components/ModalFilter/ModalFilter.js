import React from 'react'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { Form, Modal, DatePicker, Button, Select } from 'antd'
import List from './List'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const ModalFilter = ({
  cashier,
  date,
  onDateChange,
  loading,
  dispatch,
  fields,
  onSubmitFilter,
  ...modalProps,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    resetFields,
    validateFields
  }
}) => {
  const { list, listCashier, cashierInfo, modalVisible, searchText, listCashRegister, pagination,
    currentCashier } = cashier
  const modalListProps = {
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
      dispatch({
        type: 'pos/updateState',
        payload: {
          category: 'ALL CATEGORY',
          brand: 'ALL BRAND'
        }
      })
    },
    onSearch (query) {
      dispatch({
        type: 'cashier/query',
        payload: {
          page: 1,
          pageSize: 10,
          q: query === '' ? null : query
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
          modalVisible: false,
          currentCashier: { id: null, status: '' }
        }
      })
      resetFields(['cashierTransId'])
      let item = {}
      item.cashierId = record.cashierId
      item.status = getFieldValue('status')
      item.storeId = lstorage.getCurrentUserStore()
      dispatch({
        type: 'cashier/getCashRegisterByStore',
        payload: {
          item
        }
      })
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
          q: searchText === '' ? null : searchText,
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
    dispatch({ type: 'cashier/query' })
  }

  const selectStatus = (value) => {
    let item = {}
    item.cashierId = cashierInfo.cashierId
    item.status = value
    item.storeId = lstorage.getCurrentUserStore()
    if (item.cashierId) {
      dispatch({
        type: 'cashier/getCashRegisterByStore',
        payload: {
          item
        }
      })
      dispatch({
        type: 'cashier/updateState',
        payload: {
          currentCashier: { id: null, status: '' }
        }
      })
    }
  }

  let buttonName = 'Find Cashier'
  if (cashierInfo.cashierId) {
    let name = cashierInfo.cashierId
    buttonName = name
    if (name.length > 17) {
      buttonName = `${name.slice(0, 17)}...`
    }
  }
  const cashierTrans = (listCashRegister && listCashRegister.length) ? listCashRegister.map(x => (<Option value={x.id}>{`${x.shiftName}-${x.counterName}`}</Option>)) : []

  let props = {
    ...modalProps,
    onOk () {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const item = getFieldsValue()
        dispatch({
          type: 'cashier/updateState',
          payload: {
            currentCashier: { id: item.cashierTransId || null, status: item.status }
          }
        })
        let data = { date: item.date, cashierTransId: item.cashierTransId }
        onSubmitFilter(data)
      })
    }
  }

  return (
    <Modal {...props}>
      {modalVisible && <List {...modalListProps} />}
      <Form layout="vertical">
        <FormItem label="Trans Date" {...formItemLayout}>
          {getFieldDecorator('date', {
            initialValue: date,
            rules: [
              { required: true }
            ]
          })(
            <RangePicker onChange={onDateChange} size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        {fields}
        <FormItem label="Cashier Id" hasFeedback {...formItemLayout}>
          <Button type="primary" size="large" onClick={openModal} style={{ width: '50%' }}>{buttonName}</Button>
        </FormItem>
        <FormItem label="Status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentCashier.status
          })(<Select style={{ width: '50%' }} onChange={selectStatus}>
            <Option value="O">Open</Option>
            <Option value="C">Close</Option>
            <Option value="R" disabled>Request</Option>
            <Option value="V" disabled>Verify</Option>
            <Option value="">All Status</Option>
          </Select>)}
        </FormItem>
        <FormItem label="Cashier Trans" {...formItemLayout}>
          {getFieldDecorator('cashierTransId', {
            initialValue: currentCashier.id || ((listCashRegister && listCashRegister.length) ? listCashRegister[0].id : null)
          })(
            <Select disabled={!(listCashRegister && listCashRegister.length)}>
              {cashierTrans}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ cashier, loading }) => ({ cashier, loading }))(Form.create()(ModalFilter))

