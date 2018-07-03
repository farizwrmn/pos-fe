import React from 'react'
import moment from 'moment'
import { Form, Row, Col, DatePicker, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
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

const FilterTransfer = ({
  filterChange,
  filterTransNo,
  period,
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
      filterTransNo(data.period, transNo)
    } else {
      filterChange(data.period)
    }
  }

  return (
    <Row >
      <Col {...leftColumn} >
        <FormItem >
          {getFieldDecorator('period', { initialValue: period ? moment.utc(period, 'YYYY-MM') : null })(
            <MonthPicker onChange={handleChangeDate} placeholder="Select Period" />
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} >
        <FormItem >
          {getFieldDecorator('transNo')(
            <Search
              placeholder="Search Transaction No"
              onSearch={value => searchTransNo(value)}
            />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

export default Form.create()(FilterTransfer)
