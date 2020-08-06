import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Modal, Select, message, InputNumber } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'

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
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  storeInfo,
  listItem,
  listAccountCode,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.storeId = lstorage.getCurrentUserStore()
      data.memberId = data.memberId ? data.memberId.key : null
      data.supplierId = data.supplierId ? data.supplierId.key : null
      data.accountId = data.accountId ? data.accountId.key : null
      data.transType = data.transType ? data.transType.key : null
      const transDate = moment(data.transDate).format('YYYY-MM-DD')
      data.transDate = transDate
      if (transDate < storeInfo.startPeriod) {
        message.error('This period has been closed')
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, listItem, getFieldsValue())
          resetFields()
        },
        onCancel () { }
      })
    })
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem {...formItemLayout} label="From">
              {getFieldDecorator('from', {
                initialValue: item.from,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{listAccountOpt}
              </Select>)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem {...formItemLayout} label="To">
              {getFieldDecorator('to', {
                initialValue: item.to,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{listAccountOpt}
              </Select>)}
            </FormItem>
            <FormItem label="Amount" hasFeedback {...formItemLayout}>
              {getFieldDecorator('amount', {
                initialValue: item.amount
              })(
                <InputNumber
                  autoFocus
                  min={0}
                  max={9999999999}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...column} />
          <Col {...column}>
            <FormItem>
              {/* {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>} */}
              <Button type="primary" onClick={handleSubmit} style={{ float: 'right' }}>Save</Button>
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
