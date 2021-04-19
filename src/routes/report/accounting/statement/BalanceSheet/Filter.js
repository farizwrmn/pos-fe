/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

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

const Filter = ({ onDateChange, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const { to } = printProps
  const handleChange = (date) => {
    if (date) {
      const to = date.format('YYYY-MM-DD')
      onDateChange(to)
    }
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

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Trans Date">
          {getFieldDecorator('to', {
            initialValue: to ? moment.utc(to, 'YYYY-MM-DD') : null
          })(
            <DatePicker size="large" onChange={value => handleChange(value)} format="DD-MMM-YYYY" />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
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
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
