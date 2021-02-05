import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item

const searchBarLayout = {
  xs: { span: 15 },
  sm: { span: 7 },
  md: { span: 7 },
  lg: { span: 6 }
}

const Filter = ({
  rangePicker,
  query,
  onFilterChange,
  forPayment,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const { startDate, endDate } = query
  const handleSubmit = (s, dateString) => {
    let field = getFieldsValue()
    // if (field.q === undefined || field.q === '') {
    // }
    let date = []
    if (field.rangePicker && field.rangePicker[0]) {
      const fromDate = moment(field.rangePicker[0]).format('YYYY-MM-DD')
      const toDate = moment(field.rangePicker[1]).format('YYYY-MM-DD')
      date = [
        fromDate,
        toDate
      ]
    }
    if (dateString && dateString[0]) {
      const fromDate = moment(dateString[0]).format('YYYY-MM-DD')
      const toDate = moment(dateString[1]).format('YYYY-MM-DD')
      date = [
        fromDate,
        toDate
      ]
    }
    const { rangePicker, ...other } = field
    onFilterChange(other, forPayment, date[0], date[1])
  }

  return (
    <Row>
      <Col xs={9} sm={17} md={17} lg={18}>
        {rangePicker && (
          <FormItem>
            {getFieldDecorator('rangePicker', {
              initialValue: startDate ? [moment.utc(startDate, 'YYYY-MM-DD'), moment.utc(endDate, 'YYYY-MM-DD')] : [moment().startOf('month'), moment().endOf('month')],
              rules: [
                {
                  required: rangePicker,
                  message: 'Required'
                }
              ]
            })(
              <RangePicker
                placeholder="Pick a range"
                onChange={handleSubmit}
              />
            )}
          </FormItem>
        )}
      </Col>
      <Col {...searchBarLayout} >
        <FormItem >
          {getFieldDecorator('q')(
            <Search
              placeholder="Search Field"
              onSearch={() => handleSubmit()}
            />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
