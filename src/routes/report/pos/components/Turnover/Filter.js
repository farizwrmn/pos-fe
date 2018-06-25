/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Col, Icon, Select, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 4 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 20 },
    md: { span: 17 }
  }
}

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

const Filter = ({ onDateChange,
  listCategory,
  showCategories,
  listServiceType,
  onChangePeriod,
  dispatch,
  query,
  serviceType = (listServiceType || []).map(service => <Option value={service.miscName} key={service.miscName}>{service.miscName}</Option>),
  productCategory = (listCategory || []).map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>),
  onListReset,
  form: { resetFields, getFieldDecorator, getFieldsValue, validateFields },
  ...printProps }) => {
  const onChange = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      const params = {
        period: data.rangePicker ? moment(data.rangePicker).format('M') : null,
        year: data.rangePicker ? moment(data.rangePicker).format('Y') : null,
        periodNext: data.rangePicker ? moment(data.rangePickerNext).format('M') : null,
        yearNext: data.rangePicker ? moment(data.rangePickerNext).format('Y') : null,
        category: data.category,
        service: data.service
      }
      onChangePeriod(params)
    })
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  const category = () => {
    showCategories()
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...leftColumn}>
          <FormItem label="Period" {...formItemLayout}>
            {getFieldDecorator('rangePicker', {
              initialValue: query ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <MonthPicker placeholder="Select Period" />
            )}
          </FormItem>
          <FormItem label="Compare with" {...formItemLayout}>
            {getFieldDecorator('rangePickerNext', {
              initialValue: query ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <MonthPicker placeholder="Select Period" />
            )}
          </FormItem>
          <FormItem label="Service Type" {...formItemLayout}>
            {getFieldDecorator('service')(<Select
              optionFilterProp="children"
              allowClear
              mode="default"
              style={{ maxWidth: '189px' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{serviceType}
            </Select>)}
          </FormItem>
          <FormItem label="Category ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('category')(<Select
              optionFilterProp="children"
              allowClear
              onFocus={() => category()}
              mode="default"
              style={{ maxWidth: '189px' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{productCategory}
            </Select>)}
          </FormItem>
        </Col>
        <Col {...rightColumn} style={{ marginBottom: '0px', float: 'right', textAlign: 'right' }}>
          <Button
            type="dashed"
            size="large"
            style={{ marginLeft: '5px' }}
            className="button-width02 button-extra-large"
            onClick={() => onChange()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
          {<PrintPDF {...printProps} />}
          {<PrintXLS {...printProps} />}
          <Button type="dashed"
            size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onListReset: PropTypes.func.isRequired,
  onDateChange: PropTypes.func
}

export default Form.create()(Filter)
