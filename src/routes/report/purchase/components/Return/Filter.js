/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Select, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const { Option } = Select

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

const Filter = ({ listAllStores = [], onDateChange, loading, listSupplier, onSearchSupplier, onListReset, form: { getFieldsValue, validateFields, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
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

  const searchSupplier = (value) => {
    onSearchSupplier(value)
  }

  const handleChange = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const params = {
        from: data.rangePicker ? data.rangePicker[0].format('YYYY-MM-DD') : null,
        to: data.rangePicker ? data.rangePicker[1].format('YYYY-MM-DD') : null
      }
      if (data.supplierId) params.supplierId = data.supplierId.key
      if (data.storeId) params.storeId = data.storeId
      onDateChange(params)
    })
  }

  let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  let suppliers = (listSupplier || []).map(x => (<Option value={x.id} key={x.id}>{`${x.supplierName} (${x.supplierCode})`}</Option>))

  return (
    <Row >
      <Col {...leftColumn} >
        <FormItem label="Trans Date">
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
        <FormItem hasfeedback label="Supplier">
          {getFieldDecorator('supplierId')(
            <Select
              showSearch
              placeholder="Select a supplier"
              onFocus={() => searchSupplier()}
              onSearch={value => searchSupplier(value)}
              optionFilterProp="children"
              labelInValue
              allowClear
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%', marginTop: '5px' }}
            >
              {suppliers}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="Store"
          help="clear it if available all stores"
          hasFeedback
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
              {childrenStore}
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
          disabled={loading.effects['purchaseReport/query']}
          loading={loading.effects['purchaseReport/query']}
          onClick={() => handleChange()}
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
        {<PrintPDF {...printProps} />}
        {<PrintXLS {...printProps} />}
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
