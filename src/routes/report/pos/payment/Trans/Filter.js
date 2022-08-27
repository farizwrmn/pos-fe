/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, Spin, DatePicker, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintDaily from './PrintDaily'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
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

const Filter = ({ loading, getBalanceId, onDateChange, listBalance, onListReset, form: { validateFields, getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  const { from, to } = printProps
  const handleChangeDate = (value) => {
    console.log('value', value)
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    getBalanceId(from, to)
  }

  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      onDateChange(data.rangePicker[0].format('YYYY-MM-DD'), data.rangePicker[1].format('YYYY-MM-DD'), data.balanceId)
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

  let listBalanceOpt = []
  try {
    listBalanceOpt = (listBalance || []).length > 0 ? listBalance.map((c) => {
      return (
        <Option
          value={c.id}
          key={c.id}
          title={
            `${c.user.userName} | ${moment(c.open).format('DD-MMM HH:mm')
            } | ${c.closed ? moment(c.closed).format('DD-MMM HH:mm') : ''
            }`
          }
        >{
            `${c.user.userName} | ${moment(c.open).format('DD-MMM HH:mm')
            } | ${c.closed ? moment(c.closed).format('DD-MMM HH:mm') : ''
            }`
          }</Option>
      )
    }) : []
  } catch (error) {
    console.log('error', error)
  }

  return (
    <Row>
      <Col {...leftColumn}>
        <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('rangePicker', {
            initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : null,
            rules: [
              {
                required: true
              }
            ]
          })(
            <RangePicker onChange={value => handleChangeDate(value)} size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <FormItem label="Balance" hasFeedback {...formItemLayout}>
          {getFieldDecorator('balanceId')(
            <Select
              allowClear
              multiple
              style={{ width: '100%', marginTop: '10px' }}
              notFoundContent={loading.effects['posPaymentReport/queryLovBalance'] ? <Spin size="small" /> : null}
            >
              {listBalanceOpt}
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
        {<PrintDaily {...printProps} />}
        {<PrintPDF {...printProps} />}
        {<PrintXLS {...printProps} />}
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
