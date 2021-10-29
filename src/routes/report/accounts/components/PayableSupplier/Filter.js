/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { Option } = Select
const FormItem = Form.Item

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

const Filter = ({ onDateChange, listSupplier, listAllStores, loading, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, validateFields, getFieldDecorator }, ...printProps }) => {
  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      onDateChange(data)
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

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <Row >
      <Col {...leftColumn} >
        <Form>
          <FormItem
            label="Store"
          >
            {getFieldDecorator('storeId')(
              <Select
                mode="multiple"
                allowClear
                size="large"
                style={{ width: '189px' }}
                placeholder="Choose StoreId"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
          <FormItem label="Supplier">
            {getFieldDecorator('supplierId')(<Select
              showSearch
              optionFilterProp="children"
              multiple
              allowClear
              maxTagCount={5}
              // onChange={handleChange}
              style={{ width: '100%' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
        </Form>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          disabled={loading.effects['accountsReport/queryPayableTrans']}
          style={{ marginLeft: '5px' }}
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
