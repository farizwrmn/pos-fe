import React from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
    md: { span: 7 },
    lg: { span: 7 },
    xl: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 },
    xl: { span: 14 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 6 },
  xl: { span: 6 }
}

const buttonColumnProps = {
  xs: 24,
  sm: 24,
  md: 4,
  lg: 2,
  xl: 2
}

const FormSearch = ({
  loading,
  listAccountCode,
  query,
  searchQuery,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []

  const onSearch = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
    })
    const fields = getFieldsValue()
    searchQuery(fields)
  }

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
    })

    const fields = getFieldsValue()

    onSubmit({
      accountId: fields.accountId,
      from: moment(fields.rangePicker[0]).format('YYYY-MM-DD'),
      to: moment(fields.rangePicker[1]).format('YYYY-MM-DD')
    })
  }

  return (
    <Form layout="horizontal" style={{ marginBottom: '10px' }}>
      <Row>
        <Col {...column}>
          <FormItem {...formItemLayout} label="Account">
            {getFieldDecorator('accountId', {
              initialValue: query && query.accountId ? Number(query.accountId) : (listAccountCode && listAccountCode.length > 0 ? listAccountCode[0].id : undefined),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={filterOption}
            >{listAccountOpt}
            </Select>)}
          </FormItem>
        </Col>
        <Col {...column}>
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rangePicker', {
              initialValue: query && query.from && query.to ? [moment.utc(query.from, 'YYYY-MM-DD'), moment.utc(query.to, 'YYYY-MM-DD')] : null,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(
              <RangePicker size="large" format="DD-MMM-YYYY" ranges={{}} />
            )}
          </FormItem>
        </Col>
        <Col {...buttonColumnProps}>
          <FormItem>
            <Button type="primary" icon="search" onClick={handleSubmit} loading={loading.effects['autorecon/query']} />
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Col {...column}>
          <FormItem label="Search" {...formItemLayout}>
            {getFieldDecorator('q')(
              <Input placeholder="Cari Faktur Penjualan" onPressEnter={onSearch} />
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

export default Form.create()(FormSearch)
