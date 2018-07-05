import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Input } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
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

const leftColumn = {
  md: 24,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  md: 24,
  lg: 12
}

const Filter = ({
  onDateChange,
  onListReset,
  onSearch,
  list,
  onSearchSupplier,
  form: {
    resetFields,
    getFieldDecorator,
    getFieldsValue,
    validateFields
  },
  ...printProps
}) => {
  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let startPeriod = data.rangePicker[0].format('YYYY-MM-DD')
      let endPeriod = data.rangePicker[1].format('YYYY-MM-DD')
      if (data.supplierId) data.supplierId = data.supplierId.key
      delete data.rangePicker
      onSearch(data, startPeriod, endPeriod)
    })
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  const searchSupplier = (value) => {
    onSearchSupplier(value)
  }
  let suppliers = (list || []).map(x => (<Option value={x.id} key={x.id}>{`${x.supplierName} (${x.supplierCode})`}</Option>))

  return (
    <Form layout="horizontal">
      <Row >
        <Col {...leftColumn}>
          <FormItem hasfeedback label="Trans Date" {...formItemLayout}>
            {getFieldDecorator('rangePicker', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RangePicker size="large" format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem hasfeedback label="Supplier" {...formItemLayout}>
            {getFieldDecorator('supplierId')(
              <Select
                showSearch
                placeholder="Select a supplier"
                onFocus={() => searchSupplier()}
                onSearch={value => searchSupplier(value)}
                optionFilterProp="children"
                labelInValue
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: '100%', marginTop: '5px' }}
              >
                {suppliers}
              </Select>
            )}
          </FormItem>
          <FormItem hasfeedback label="Trans No" {...formItemLayout}>
            {getFieldDecorator('transNo')(
              <Input maxLength={50} style={{ width: '100%', marginTop: '5px' }} />
            )}
          </FormItem>
        </Col >
        <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
          <Button
            size="large"
            style={{ marginLeft: '5px' }}
            type="primary"
            className="button-width02 button-extra-large"
            onClick={() => handleSearch()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
          <Button type="dashed"
            size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          <PrintPDF {...printProps} />
          <PrintXLS {...printProps} />
        </Col>
      </Row >
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(Filter)
