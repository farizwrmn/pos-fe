import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form, Input } from 'antd'
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

const Filter = ({ dispatch, activeKey, onDateChange, onListReset, form: { validateFields, getFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const handleReset = () => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey
      }
    }))
    resetFields()
    onListReset()
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 9 },
      sm: { span: 8 },
      md: { span: 7 }
    },
    wrapperCol: {
      xs: { span: 15 },
      sm: { span: 16 },
      md: { span: 14 }
    }
  }
  const monthPickerProps = {
    size: 'large',
    placeholder: 'Select period',
    format: 'YYYY-MM'
  }
  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let period = moment(data.monthPicker).format('MM')
      let year = moment(data.monthPicker).format('YYYY')
      onDateChange(period, year, data.transNo === '' ? null : data.transNo)
    })
  }

  return (
    <Row>
      <Col {...leftColumn}>
        <Form.Item label="Period" hasFeedback {...formItemLayout}>
          {getFieldDecorator('monthPicker')(
            <MonthPicker style={{ marginBottom: '8px', width: '100%' }} {...monthPickerProps} />
          )}
        </Form.Item>
        <Form.Item label="Transaction No" hasFeedback {...formItemLayout}>
          {getFieldDecorator('transNo')(
            <Input.Search onSearch={() => handleSearch()} size="large" placeholder="Find by Transaction" style={{ marginBottom: '8px', width: '100%' }} />
          )}
        </Form.Item>
      </Col>
      <Col {...rightColumn} style={{ textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
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
