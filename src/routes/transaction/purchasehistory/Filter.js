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
  const data = {
    ...getFieldsValue()
  }

  const handleChangeDate = (date, dateString) => {
    filterChange(dateString)
    resetFields(['transNo'])
  }

  const searchTransNo = (transNo) => {
    if (transNo.length > 0) {
      filterTransNo(transNo)
    } else {
      filterChange(data.period)
    }
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
          {getFieldDecorator('transNo')(
            <Search
              placeholder="Search Invoice"
              onSearch={value => searchTransNo(value)}
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
