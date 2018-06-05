import React from 'react'
// import moment from 'moment'
import { Form, Row, Col, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
// const { MonthPicker } = DatePicker

const filterItemLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FilterTransfer = ({
  filterTransNo,
  // period,
  form: {
    getFieldDecorator
  }
}) => {
  const searchTransNo = (transNo) => {
    filterTransNo(transNo === '' ? null : transNo)
  }

  return (
    <Row gutter={24}>
      <Col {...filterItemLayout} >
        {/* <FormItem >
          {getFieldDecorator('period', { initialValue: period ? moment.utc(period, 'YYYY-MM') : null })(
            <MonthPicker onChange={handleChangeDate} placeholder="Select Period" />
          )}
        </FormItem> */}
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
