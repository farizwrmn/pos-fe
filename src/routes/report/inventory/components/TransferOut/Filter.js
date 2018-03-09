import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker

const Filter = ({ onDateChange, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
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

  const monthPickerProps = {
    size: 'large',
    placeholder: 'Select period',
    format: 'YYYY-MM',
    onChange (value) {
      const month = value.format('MM')
      const year = value.format('YYYY')
      onDateChange(month, year)
    }
  }

  return (
    <div>
      <Row>
        <Col lg={10} md={24}>
          <FilterItem label="Period">
            {getFieldDecorator('monthPicker')(
              <MonthPicker {...monthPickerProps} />
            )}
          </FilterItem>
        </Col>
        <Col lg={14} md={24} style={{ textAlign: 'right' }}>
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
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
