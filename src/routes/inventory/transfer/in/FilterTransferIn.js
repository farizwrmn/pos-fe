import React from 'react'
import moment from 'moment'
import { Form, Row, Col, DatePicker, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { MonthPicker } = DatePicker

const filterItemLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
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
    <Row gutter={24}>
      <Col {...filterItemLayout} >
        <FormItem >
          {getFieldDecorator('period', { initialValue: moment.utc(period, 'YYYY-MM') })(
            <MonthPicker onChange={handleChangeDate} placeholder="Select Period" />
          )}
        </FormItem>
      </Col>
      <Col {...filterItemLayout} >
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
