import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Modal, DatePicker, Button, Row, Col } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'
import List from './List'
import ModalClosing from './ModalClosing'

const FormItem = Form.Item
const { RangePicker } = DatePicker
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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  listProps,
  listAllStores,
  modalClosingProps,
  onClosing,
  onSubmit,
  modalType,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data && data.transDate) {
        data.transDate = [data.transDate[0], data.transDate[1]]
      } else {
        data.transDate = undefined
      }
      if (data.storeId) {
        const filteredStore = listAllStores && listAllStores.filter(filtered => parseFloat(filtered.id) === parseFloat(data.storeId))
        if (filteredStore && filteredStore.length > 0) {
          data.storeName = filteredStore[0].storeName
        }
      }
      if (data && data.transDate && data.transDate[0] && data.transDate[1]) {
        data.transDate = [data.transDate[0].format('YYYY-MM-DD'), data.transDate[1].format('YYYY-MM-DD')]
      }
      onSubmit(data)
    })
  }

  const handleClose = () => {
    if (!item.storeId) {
      Modal.error({
        title: 'Store Not Found',
        content: 'Press filter button'
      })
      return
    }
    onClosing(item.storeId)
  }

  const listStore = listAllStores.map(x => (<Option title={x.label} value={x.value} key={x.value}>{x.label}</Option>))

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: item.from && item.to ? [moment.utc(item.from, 'YYYY-MM-DD'), moment.utc(item.to, 'YYYY-MM-DD')] : null,
              rules: [
                {
                  required: false
                }
              ]
            })(<RangePicker allowClear size="large" format="DD-MMM-YYYY" />)}
          </FormItem>
          <FormItem
            label="Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('storeId', {
              initialValue: item.storeId ? parseFloat(item.storeId) : lstorage.getCurrentUserStore(),
              rules: [{
                required: true
              }]
            })(
              <Select
                mode="default"
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listStore}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit}>Filter</Button>
          </FormItem>
        </Col>
      </Row>
      <List {...listProps} />
      <Button style={{ float: 'right', marginTop: '20px' }} type="primary" onClick={handleClose}>Close</Button>
      {modalClosingProps.visible && <ModalClosing {...modalClosingProps} />}
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
