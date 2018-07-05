import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { routerRedux } from 'dva/router'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
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

const Filter = ({ dispatch, activeKey, onDateChange, onListReset, form: { resetFields, getFieldDecorator }, ...printProps }) => {
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

  const monthPickerProps = {
    size: 'large',
    placeholder: 'Select period',
    format: 'YYYY-MM',
    onChange (value) {
      if (value) {
        const month = value.format('MM')
        const year = value.format('YYYY')
        onDateChange(month, year)
      } else {
        const { pathname } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            activeKey
          }
        }))
        onListReset()
      }
      resetFields()
    }
  }

  const params = location.search.substring(1)
  let query = params ? JSON.parse(`{"${decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {}

  if (!query.year && !query.period) {
    resetFields(['monthPicker'])
  }

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('monthPicker', { initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '' })(
            <MonthPicker {...monthPickerProps} />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ textAlign: 'right' }}>
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
    </Row >
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
