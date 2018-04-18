import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { routerRedux } from 'dva/router'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker

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
    <div>
      <Row>
        <Col lg={10} md={24}>
          <FilterItem label="Period">
            {getFieldDecorator('monthPicker', { initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '' })(
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
