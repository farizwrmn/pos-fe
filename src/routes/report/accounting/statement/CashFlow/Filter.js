/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form, Modal } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker

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

const Filter = ({ onDateChange, onListReset, form: { validateFields, getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const { from, to } = printProps
  const handleChange = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      if (data.from && data.to) {
        const from = data.from.startOf('month').format('YYYY-MM-DD')
        const to = data.to.endOf('month').format('YYYY-MM-DD')
        onDateChange(from, to)
      } else {
        Modal.warning({
          title: 'Cannot find parameter',
          content: 'Try to reset the form',
          onOk () {
          },
          onCancel () {

          }
        })
      }
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

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="From">
          {getFieldDecorator('from', {
            initialValue: from ? moment.utc(from, 'YYYY-MM') : null
          })(
            <MonthPicker
              size="large"
              format="MMM-YYYY"
              style={{ marginBottom: '1em' }}
            />
          )}
        </FilterItem>
        <FilterItem label="To">
          {getFieldDecorator('to', {
            initialValue: to ? moment.utc(to, 'YYYY-MM') : null
          })(
            <MonthPicker
              size="large"
              format="MMM-YYYY"
            />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
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
