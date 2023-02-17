import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 17 },
    md: { span: 17 }
  }
}

const column = {
  xs: { span: 24 },
  md: { span: 24 },
  lg: { span: 6 }
}

const FormCounter = ({
  listBankRecon,
  accountId,
  loading,
  onSubmit,
  showImportDialog,
  autoRecon,
  listAccountCode,
  from,
  to,
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
        to: moment(data.rangePicker[1]).format('YYYY-MM-DD'),
        recon: 0
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
                initialValue: accountId ? Number(accountId) : (listAccountCode && listAccountCode.length > 0 ? listAccountCode[0].id : undefined),
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
                initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : null,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(
                <RangePicker size="large" format="DD-MMM-YYYY" />
              )}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem>
              {/* {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>} */}
              <Button type="primary" icon="check" style={{ float: 'right', marginLeft: '10px' }} onClick={() => autoRecon()} disabled={!listBankRecon.length > 0} >Start Auto Recon</Button>
              <Button type="primary" icon="download" style={{ float: 'right', marginLeft: '10px' }} onClick={() => showImportDialog()} />
              <Button type="primary" icon="search" loading={loading && loading.effects['bankentry/queryBankRecon']} disabled={loading && loading.effects['bankentry/queryBankRecon']} onClick={handleSubmit} style={{ float: 'right' }} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
