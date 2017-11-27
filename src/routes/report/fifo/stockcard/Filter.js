/**
 * Created by Veirry on 23/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Spin } from 'antd'
import { FilterItem } from 'components'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'
import Search from 'antd/lib/input/Search';
const Option = Select.Option
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Filter = ({ onOk, period, year, onChangePeriod, productCode, dispatch, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator, validateFields }, ...printProps }) => {
  let optionSelect = []
  const selectChildren = () => {
    for (let i = 0; i < productCode.length; i++) {
      optionSelect.push(<Option key={productCode[i].toString(36)}>{productCode[i].toString(36)}</Option>);
    }
  }

  const exportProps = {
    period,
    year,
    ...printProps
  }

  const formItemLayout = {
    labelCol: { xl: { span: 8 }, lg: { span: 8 }, md: { span: 24 }, sm: { span: 24 } },
    wrapperCol: { xl: { span: 12 }, lg: { span: 12 }, md: { span: 24 }, sm: { span: 24 } },
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let period = moment(data.Period).format('M')
      let year = moment(data.Period).format('Y')
      onOk(period, year, data)
    })
  }

  const onChange = (date, dateString) => {
    let period = moment(dateString).format('M')
    let year = moment(dateString).format('Y')
    onChangePeriod(period, year)
    resetFields(['productCode'])
  }

  return (
    <div>
      <Form
        layout="inline">
        <Row>
          <Col xl={14} lg={14} md={10} sm={24} >
            <FormItem label="Period" hasFeedback {...formItemLayout}>
              {getFieldDecorator('Period', {
                initialValue: moment.utc(period+ '-' + year, 'MM-YYYY'),
                rules: [
                  {
                    required: true
                  },
                ],
              })(<MonthPicker onChange={onChange} placeholder="Select Period" />)}
            </FormItem>
            <FormItem label="Product Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productCode', {
                rules: [{
                  required: true,
                }],
              })(<Select
                mode="multiple"
                style={{ width: '189px', marginBottom: '10px' }}
                placeholder="Select Code"
                onFocus={selectChildren()}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                {...printProps}
                >
                {optionSelect}
              </Select>)}
            </FormItem>
          </Col>
          <Col xl={10} lg={10} md={10} sm={24} style={{ textAlign: 'right' }}>
            <FormItem>
              <Button type="dashed"
                size="large"
                style={{ marginLeft: '5px' }}
                type="primary"
                className="button-width02 button-extra-large"
                onClick={() => handleSearch()}
              >
                <Icon type="search" className="icon-large" />
              </Button>
              <Button type="dashed"
                size="large"
                className="button-width02 button-extra-large bgcolor-grey"
                onClick={() => handleReset()}
              >
                <Icon type="rollback" className="icon-large" />
              </Button>
              {<PrintPDF {...exportProps} />}
              {<PrintXLS {...exportProps} />}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  productCode: PropTypes.array,
  period: PropTypes.string,
  year: PropTypes.string
}

export default Form.create()(Filter)
