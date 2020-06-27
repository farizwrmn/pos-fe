/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker

const leftColumn = {
  xs: 24,
  sm: 14,
  md: 14,
  lg: 14,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 10,
  md: 10,
  lg: 10
}

const Filter = ({
  onOk,
  onChangePeriod,
  dispatch,
  onListReset,
  onShowCategories,
  onShowBrands,
  form: {
    resetFields,
    getFieldDecorator
  },
  activeKey,
  ...otherProps
}) => {
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

  const onChange = (date, dateString) => {
    if (date) {
      let period = dateString ? moment(dateString).format('M') : null
      let year = dateString ? moment(dateString).format('Y') : null
      onChangePeriod(period, year)
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

  const params = location.search.substring(1)
  let query = params ? JSON.parse(`{"${decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {}

  if (!query.year && !query.period) {
    resetFields(['rangePicker'])
  }

  const printProps = {
    activeKey,
    ...otherProps
  }

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker', {
            initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : ''
          })(
            <MonthPicker onChange={onChange} placeholder="Select Period" />
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
