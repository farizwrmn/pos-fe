/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, message, Select, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
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

const Filter = ({ listAllStores, loading, onDateChange, onListReset, form: { getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const handleChange = () => {
    const value = getFieldValue('rangePicker')
    const storeId = getFieldValue('storeId')
    if (!value) {
      message.warning('Require date')
      return
    }
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to, storeId)
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
        <FilterItem label="Trans Date">
          {getFieldDecorator('rangePicker')(
            <RangePicker size="large" format="DD-MMM-YYYY" />
          )}
        </FilterItem>
        <FilterItem
          label="Store"
        >
          {getFieldDecorator('storeId')(
            <Select
              mode="multiple"
              allowClear
              size="large"
              style={{ width: '189px', marginTop: '10px' }}
              placeholder="Choose StoreId"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenTransNo}
            </Select>
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          disabled={loading.effects['accountsReport/queryPayableTrans']}
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
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
