/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4, textAlign: 'left' },
  wrapperCol: { span: 20 }
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

const Filter = ({ listAllStores, compareTo, loading, onDateChange, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator, validateFields }, ...printProps }) => {
  const { to } = printProps
  const handleChange = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      const params = {
        storeId: data.storeId,
        compareTo: data.compareTo ? data.compareTo.format('YYYY-MM-DD') : undefined,
        to: data.to.format('YYYY-MM-DD')
      }
      onDateChange(params)
    })
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    resetFields()
    onListReset()
  }

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <Row>
      <Col {...leftColumn} >
        <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('to', {
            initialValue: to ? moment.utc(to, 'YYYY-MM-DD') : null,
            rules: [
              {
                required: true
              }
            ]
          })(
            <DatePicker size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <FormItem label="Compare To" hasFeedback {...formItemLayout}>
          {getFieldDecorator('compareTo', {
            initialValue: compareTo ? moment.utc(compareTo, 'YYYY-MM-DD') : null,
            rules: [
              {
                required: false
              }
            ]
          })(
            <DatePicker size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <FormItem
          label="Store"
          help="clear it if available all stores"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('storeId')(
            <Select
              mode="multiple"
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Store"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenTransNo}
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
          loading={loading.effects['accountingStatementReport/queryBalanceSheet'] || loading.effects['accountingStatementReport/query']}
          onClick={() => handleChange()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          loading={loading.effects['accountingStatementReport/queryBalanceSheet'] || loading.effects['accountingStatementReport/query']}
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        {((printProps.listTrans && printProps.listTrans.length > 0) || (printProps.listProfit && printProps.listProfit.length > 0))
          && !loading.effects['accountingStatementReport/queryBalanceSheet'] && !loading.effects['accountingStatementReport/query']
          && <PrintPDF {...printProps} />}
        {((printProps.listTrans && printProps.listTrans.length > 0) || (printProps.listProfit && printProps.listProfit.length > 0))
          && !loading.effects['accountingStatementReport/queryBalanceSheet'] && !loading.effects['accountingStatementReport/query']
          && <PrintXLS {...printProps} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
