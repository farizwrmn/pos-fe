/**
 * Created by Veirry on 23/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Modal } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const Option = Select.Option
const { MonthPicker } = DatePicker
const FormItem = Form.Item

const Filter = ({ onOk, period, year, onChangePeriod, productCode, productName, dispatch, onListReset, form: { getFieldsValue, resetFields, getFieldDecorator, validateFields }, ...printProps }) => {
  let optionSelect = []
  let optionSelectName = []
  const selectChildren = () => {
    for (let i = 0; i < productCode.length; i += 1) {
      optionSelect.push(<Option key={productCode[i].toString(36)}>{productCode[i].toString(36)}</Option>)
    }
  }
  const selectChildrenName = () => {
    for (let i = 0; i < productCode.length; i += 1) {
      optionSelectName.push(<Option key={productName[i].toString(36)}>{productName[i].toString(36)}</Option>)
    }
  }
  const exportProps = {
    period,
    year,
    ...printProps
  }
  const formItemLayout = {
    labelCol: { xl: { span: 8 }, lg: { span: 8 }, md: { span: 24 }, sm: { span: 24 } },
    wrapperCol: { xl: { span: 12 }, lg: { span: 12 }, md: { span: 24 }, sm: { span: 24 } }
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
      if (data.productCode === undefined) {
        data.productCode = []
      }
      if (data.productName === undefined) {
        data.productName = []
      }
      if (data.productCode.length === 0 && data.productName.length === 0) {
        Modal.confirm({
          title: 'Cannot find parameter',
          content: 'Try to reset the form',
          onOk () {
            handleReset()
          },
          onCancel () {

          }
        })
        return
      }
      let period = moment(data.Period).format('M')
      let year = moment(data.Period).format('Y')
      onOk(period, year, data)
    })
  }
  const resetSelected = (e) => {
    resetFields([e])
  }
  const onChange = (date, dateString) => {
    let period = moment(dateString).format('M')
    let year = moment(dateString).format('Y')
    onChangePeriod(period, year)
    resetFields()
  }
  return (
    <div>
      <Form
        layout="horizontal"
      >
        <Row>
          <Col xl={14} lg={14} md={10} sm={24} >
            <FormItem label="Period" className="ant-form-item-margin-bottom" hasFeedback {...formItemLayout}>
              {getFieldDecorator('Period', {
                initialValue: moment.utc(`${period}-${year}`, 'MM-YYYY'),
                rules: [
                  {
                    required: true
                  }
                ]
              })(<MonthPicker onChange={onChange} placeholder="Select Period" />)}
            </FormItem>
            <FormItem label="Product Code" className="ant-form-item-margin-bottom" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productCode', {
              })(<Select
                mode="multiple"
                style={{ width: '189px' }}
                placeholder="Select Code"
                onFocus={selectChildren()}
                onChange={() => resetSelected('productName')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                {...printProps}
              >
                {optionSelect}
              </Select>)}
            </FormItem>
            <FormItem label="Product Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productName', {
              })(<Select
                mode="multiple"
                style={{ width: '189px' }}
                placeholder="Select Code"
                onFocus={selectChildrenName()}
                onChange={() => resetSelected('productCode')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                {...printProps}
              >
                {optionSelectName}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={10} lg={10} md={10} sm={24} style={{ textAlign: 'right' }}>
            <FormItem>
              <Button
                type="dashed"
                size="large"
                style={{ marginLeft: '5px' }}
                className="button-width02 button-extra-large"
                onClick={() => handleSearch()}
              >
                <Icon type="search" className="icon-large" />
              </Button>
              <Button type="dashed"
                size="large"
                className="button-width02 button-extra-large bgcolor-lightgrey"
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
