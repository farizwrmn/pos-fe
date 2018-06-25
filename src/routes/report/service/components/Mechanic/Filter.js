/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form, Radio } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const RadioGroup = Radio.Group
const { RangePicker } = DatePicker

const leftColumn = {
  xs: 24,
  sm: 13,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 11,
  md: 12,
  lg: 12
}

const Filter = ({ onDateChange, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const handleChange = () => {
    const data = getFieldsValue()
    if (data.rangePicker || !((data.rangePicker || []).length === 0)) {
      const from = data.rangePicker[0].format('YYYY-MM-DD')
      const to = data.rangePicker[1].format('YYYY-MM-DD')
      const hasEmployee = Number(data.hasEmployee)
      onDateChange(from, to, hasEmployee)
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
    <div>
      <Row>
        <Col {...leftColumn}>
          <FilterItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large" format="DD-MMM-YYYY" />
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
      <Row>
        <Col {...leftColumn}>
          <FilterItem label="Has Employee ?">
            {getFieldDecorator('hasEmployee', { initialValue: 1 })(
              <RadioGroup>
                <Radio value={0}>
                  No Employee
                </Radio>
                <Radio value={1}>
                  Employee
                </Radio>
              </RadioGroup>
            )}
          </FilterItem>
        </Col>
      </Row>
    </div >
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
