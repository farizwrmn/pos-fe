/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Select, Col, Icon, Form, Input } from 'antd'
import { FilterItem } from 'components'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const Option = Select.Option

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

const { MonthPicker } = DatePicker

const Filter = ({ onDateChange, listGroup, showCustomerGroup, onListReset, form: { getFieldsValue, setFieldsValue, validateFields, resetFields, getFieldValue, getFieldDecorator },
  childrenGroup = (listGroup || []).map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>),
  ...printProps
}) => {
  const handleChange = () => {
    validateFields((errors) => {
      if (errors) return
      const data = getFieldsValue()
      // const to = value[1].format('YYYY-MM-DD')
      data.from = moment(getFieldValue('rangePicker'), 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
      data.to = moment(getFieldValue('rangePicker'), 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
      const { rangePicker, ...other } = data
      onDateChange(other)
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

  const customerGroup = () => {
    showCustomerGroup()
  }
  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Periode" hasFeedback>
          {getFieldDecorator('rangePicker', {
            rules: [{ required: true }]
          })(
            <MonthPicker size="large" />
          )}
        </FilterItem>
        <div style={{ height: 5 }} />
        <FilterItem label="Member Group" hasFeedback>
          {getFieldDecorator('memberGroupId', {
            rules: [
              {
                required: false
              }
            ]
          })(
            <Select
              style={{ width: '100%' }}
              mode="multiple"
              showSearch
              autoFocus
              placeholder="Select Member Group Name"
              optionFilterProp="children"
              allowClear
              onFocus={customerGroup}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{childrenGroup}
            </Select>
          )}
        </FilterItem>
        <FilterItem label="Member Name" hasFeedback>
          {getFieldDecorator('memberName')(
            <Input onPressEnter={handleChange} />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
          onClick={handleChange}
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
