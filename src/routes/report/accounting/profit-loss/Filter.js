/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: { span: 4, textAlign: 'left' },
  wrapperCol: { span: 20 }
}

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const Filter = ({ listAllStores, from, to, loading, onDateChange, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator, validateFields } }) => {
  const handleChange = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const params = {
        storeId: data.storeId,
        from: data.rangePicker ? data.rangePicker[0].format('YYYY-MM-DD') : null,
        to: data.rangePicker ? data.rangePicker[1].format('YYYY-MM-DD') : null
      }
      onDateChange(params)
    })
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    resetFields()
    onListReset()
  }

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <Row>
      <Col {...leftColumn} >
        <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('rangePicker', {
            initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : null,
            rules: [
              {
                required: true
              }
            ]
          })(
            <RangePicker size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <FormItem
          label="Store"
          help="clear it if available all stores"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('storeId')(
            <Select
              mode="multiple"
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Store"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenTransNo}
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
          disabled={loading}
          loading={loading}
          onClick={() => handleChange()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          disabled={loading}
          loading={loading}
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
