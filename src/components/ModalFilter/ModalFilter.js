import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { Form, Modal, DatePicker } from 'antd'
import List from './List'

const FormItem = Form.Item
const { RangePicker } = DatePicker

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
  addOn,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    resetFields,
    validateFields
  }
}) => {
  const { listCashier, modalVisible, searchText, pagination } = cashier
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
          currentCashier: { id: null, status: null }
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

  let modalOpts = {
    ...modalProps,
    onOk () {
      validateFields((errors) => {
        if (errors) {
          return
        }
        let data = { ...getFieldsValue() }
        onSubmitFilter(data)
      })
    }
  }

  return (
    <Modal {...modalOpts} className="modal-browse-fix-size">
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
        {addOn.map(data =>
          (<FormItem label={data.label} {...formItemLayout}>
            {getFieldDecorator(data.decorator)(data.component)}
          </FormItem>))}
      </Form>
    </Modal>
  )
}

ModalFilter.propTypes = {
  addOn: PropTypes.array
}

ModalFilter.defaultProps = {
  addOn: []
}

export default connect(({ cashier, loading }) => ({ cashier, loading }))(Form.create()(ModalFilter))

