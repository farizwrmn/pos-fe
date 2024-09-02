import React from 'react'
import { Form, Button, Select, DatePicker, Col, Row } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { RangePicker } = DatePicker
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
  lg: { span: 8 },
  xl: { span: 8 }
}

const buttonColumnProps = {
  xs: 24,
  sm: 24,
  md: 10,
  lg: 8,
  xl: 8
}

const FormAutoCounter = ({
  listAccountCode,
  showImportModal,
  onSubmit,
  loading,
  query,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onSubmit({
        accountId: data.accountId,
        from: moment(data.rangePicker[0]).format('YYYY-MM-DD'),
        to: moment(data.rangePicker[1]).format('YYYY-MM-DD')
      })
    })
  }

  return (
    <div>
      <Form layout="horizontal">
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
              <Button style={{ marginRight: '10px' }} type="secondary" icon="download" onClick={() => showImportModal()} loading={loading.effects['autorecon/autoRecon'] || loading.effects['autorecon/add']} >Import</Button>
              <Button type="primary" icon="check" onClick={() => handleSubmit()} loading={loading.effects['autorecon/autoRecon'] || loading.effects['autorecon/add']} > Start Reconciliation</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div >
  )
}

export default Form.create()(FormAutoCounter)
