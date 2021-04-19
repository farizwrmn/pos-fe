/**
 * Created by Veirry on 10/09/2017.
 */
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

const Filter = ({ onDateChange, loading, onListReset, form: { getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  // const handleChange = (value) => {
  //   const from = moment(value, 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
  //   const to = moment(value, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
  //   onDateChange(from, to)
  // }
  const handleSearch = () => {
    const from = moment(getFieldValue('rangePicker'), 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
    const to = moment(getFieldValue('rangePicker'), 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
    onDateChange(from, to)
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
    <Row >
      <Col {...leftColumn} >
        <Form layout="inline">
          <FormItem label="Trans Date">
            {getFieldDecorator('rangePicker', {
              initialValue: moment()
            })(
              <MonthPicker size="large" style={{ width: '189px' }} placeholder="Select Period" />
            )}
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
