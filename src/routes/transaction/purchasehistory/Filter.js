import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Row, Col, DatePicker, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { MonthPicker } = DatePicker

const filterItemLayout = {
  xs: { span: 12 },
  sm: { span: 16 },
  md: { span: 16 },
  lg: { span: 17 }
}

const searchBarLayout = {
  xs: { span: 24 },
  sm: { span: 8 },
  md: { span: 8 },
  lg: { span: 7 }
}

const Filter = ({
  filterChange,
  filterTransNo,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleChangeDate = (date, dateString) => {
    filterChange(dateString)
    resetFields(['transNo', 'supplierName'])
  }

  const searchTransNo = () => {
    const data = {
      ...getFieldsValue()
    }
    const { period, ...other } = data
    filterTransNo({
      startPeriod: moment(period).startOf('month').format('YYYY-MM-DD'),
      endPeriod: moment(period).endOf('month').format('YYYY-MM-DD'),
      ...other
    })
  }

  const disabledDate = (current) => {
    return current > moment().endOf('day')
  }

  return (
    <Row>
      <Col {...filterItemLayout} >
        <FormItem >
          {getFieldDecorator('period', { initialValue: moment(new Date(), 'YYYY-MM') })(
            <MonthPicker disabledDate={disabledDate} onChange={handleChangeDate} placeholder="Select Period" />
          )}
        </FormItem>
      </Col>
      <Col {...searchBarLayout} >
        <FormItem >
          {getFieldDecorator('q')(
            <Search
              placeholder="Search Invoice"
              onSearch={() => searchTransNo()}
            />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  filterChange: PropTypes.func,
  filterTransNo: PropTypes.func,
  period: PropTypes.string,
  status: PropTypes.string,
  form: PropTypes.object
}

export default Form.create()(Filter)
