import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker
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

const Filter = ({
  onDateChange,
  loading,
  resetList,
  form: {
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    resetFields,
    getFieldDecorator
  },
  ...printProps }) => {
  const handleSearch = () => {
    const period = getFieldValue('rangePicker')
    if (period) {
      const to = moment(period, 'YYYY-MM-DD').format('M')
      const from = moment(period, 'YYYY-MM-DD').subtract(1, 'months').format('M')
      const year = moment(period, 'YYYY-MM-DD').subtract(1, 'months').format('YYYY')
      onDateChange(from, to, year)
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
    resetList()
  }

  const disabledDate = (current) => {
    return Number(moment(current.valueOf()).format('MM')) === Number(1)
  }

  return (
    <Row >
      <Col {...leftColumn} >
        <Form layout="inline">
          <FormItem label="Period">
            {getFieldDecorator('rangePicker')(
              <MonthPicker disabledDate={disabledDate} size="large" />
            )}
          </FormItem>
        </Form>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          disabled={loading}
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
