/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import { FilterItem } from 'components'
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

const Filter = ({ onChangePeriod, dispatch, onListReset, form: { resetFields, getFieldDecorator }, ...printProps }) => {
  // const handleChange = (value) => {
  //   const from = value[0].format('YYYY-MM-DD')
  //   const to = value[1].format('YYYY-MM-DD')
  //   onDateChange(from, to)
  // }

  const handleReset = () => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname
    }))
    resetFields()
    onListReset()
  }

  const onChange = (date, dateString) => {
    let period = dateString ? moment(dateString).format('M') : null
    let year = dateString ? moment(dateString).format('Y') : null
    onChangePeriod(period, year)
  }

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker')(
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
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
