import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Select, Row, Col, DatePicker, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const filterItemLayout = {
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 6 },
  xl: { span: 6 }
}

const Filter = ({
  filterChange,
  filterTransNo,
  period,
  status,
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
    filterChange(dateString, data.status)
    resetFields(['transNo'])
  }

  const handleChangeStatus = (value) => {
    filterChange(data.period, value)
    resetFields(['transNo'])
  }

  const searchTransNo = (transNo) => {
    if (transNo.length > 0) {
      filterTransNo(data.period, data.status, transNo)
    } else {
      filterChange(data.period, data.status)
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
          {getFieldDecorator('status', { initialValue: status })(
            <Select onChange={handleChangeStatus} style={{ width: 120 }}>
              <Option value="in">In</Option>
              <Option value="out">Out</Option>
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...searchBarLayout} >
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

Filter.propTypes = {
  filterChange: PropTypes.func,
  filterTransNo: PropTypes.func,
  period: PropTypes.string,
  status: PropTypes.string,
  form: PropTypes.object
}

export default Form.create()(Filter)
