import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button, Row, Col } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'

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
  listAllStores,
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
      onSubmit(data)
    })
  }

  const listStore = listAllStores.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))

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
              initialValue: item.storeId ? item.storeId : lstorage.getCurrentUserStore(),
              rules: [{
                required: true
              }]
            })(
              <Select
                mode="default"
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose StoreId"
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
