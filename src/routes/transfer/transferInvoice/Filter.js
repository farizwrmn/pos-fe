import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const { RangePicker } = DatePicker
const { Option } = Select
const Search = Input.Search
const FormItem = Form.Item

const searchBarLayout = {
  md: { span: 24 },
  lg: { span: 12 }
}

const Filter = ({
  rangePicker,
  query,
  listAllStores,
  onFilterChange,
  forPayment,
  form: {
    getFieldDecorator,
    getFieldsValue
  },
  ...printProps
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
    const { rangePicker, storeIdReceiver, ...other } = field
    onFilterChange(
      other,
      forPayment,
      date[0],
      date[1],
      storeIdReceiver)
  }

  let childrenTransNo = listAllStores && listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <div>
      <Row>
        <Col md={24} lg={12}>
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
          <FormItem>
            {getFieldDecorator('storeIdReceiver')(
              <Select
                mode="default"
                allowClear
                size="large"
                style={{ minWidth: '300px' }}
                placeholder="Choose StoreId"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col style={{ float: 'right' }} {...searchBarLayout} >
          <FormItem>
            {getFieldDecorator('q')(
              <Search
                placeholder="Search Field"
                onSearch={() => handleSubmit()}
              />
            )}
          </FormItem>
          {<PrintPDF {...printProps} />}
          {<PrintXLS {...printProps} />}
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
