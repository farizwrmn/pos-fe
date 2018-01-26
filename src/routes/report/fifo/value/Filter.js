/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import { FilterItem } from 'components'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker

const Filter = ({ onChangePeriod, dispatch, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {

  const handleChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  const handleReset = () => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
    }))
    resetFields()
    onListReset()
  }

  const onChange = (date, dateString) => {
    let period = moment(dateString).format('M')
    let year = moment(dateString).format('Y')
    onChangePeriod(period, year)
  }

  return (
    <div>
      <Row style={{ display: 'flex' }}>
        <Col span={10} >
          <FilterItem label="Period">
            {getFieldDecorator('rangePicker')(
              <MonthPicker onChange={onChange} placeholder="Select Period" />
            )}
          </FilterItem>
        </Col>
        <Col span={14} style={{ float: 'right', textAlign: 'right' }}>
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
    </div>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
