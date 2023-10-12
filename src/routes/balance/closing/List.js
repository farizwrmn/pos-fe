import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Modal, InputNumber, Row, Col } from 'antd'
import { lstorage } from 'utils'
import {
  BALANCE_TYPE_TRANSACTION
} from 'utils/variable'
import FormHeader from './Form'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const FormLabel = () => {
  return (
    <Row label={(<div />)} hasFeedback {...formItemLayout}>
      <Col {...formItemLayout.labelCol} />
      <Col {...formItemLayout.wrapperCol}>
        <Row>
          <Col span={8}><div>Sales</div></Col>
        </Row>
      </Col>
    </Row>
  )
}

const FormComponent = ({
  label,
  name,
  getFieldDecorator
}) => {
  return (
    <FormItem label={label} hasFeedback {...formItemLayout}>
      <Row>
        <Col span={8}>
          <div>
            {getFieldDecorator(`detail[${name}][balanceIn]`, {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber
                min={0}
                style={{ width: '60%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            )}
          </div>
        </Col>
      </Row>
    </FormItem>
  )
}

const List = ({
  item,
  loading,
  listOpts = [],
  listShift,
  listUser,
  button,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          resetFields()
        },
        onCancel () { }
      })
    })
  }

  const formComponentProps = {
    item,
    listShift,
    listUser,
    form: {
      getFieldDecorator
    }
  }

  return (
    <Form layout="horizontal">
      <FormHeader {...formComponentProps} />
      <FormLabel />
      {listOpts && listOpts.map((detail) => {
        const filteredValue = item && item.transaction ? item.transaction.filter(filtered => filtered.balanceType === BALANCE_TYPE_TRANSACTION && filtered.paymentOptionId === detail.id) : []
        if (filteredValue && filteredValue[0]) {
          return (
            <FormComponent
              defaultValue={filteredValue}
              getFieldDecorator={getFieldDecorator}
              label={detail.typeName}
              name={detail.typeCode}
            />
          )
        }
        return null
      })}
      <Button type="primary" disabled={loading.effects['balance/closed']} onClick={handleSubmit}>{button}</Button>
    </Form>
  )
}

List.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default Form.create()(List)
