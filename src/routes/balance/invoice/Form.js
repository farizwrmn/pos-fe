import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import moment from 'moment'
import CurrentList from './CurrentList'

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 16 },
  xl: { span: 16 }
}

const FormComponent = ({
  item = {},
  dispatch,
  button,
  onSubmit,
  modalType,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 16 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      if (button === 'Open') {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data)
            resetFields()
          },
          onCancel () { }
        })
      } else {
        dispatch(routerRedux.push('/balance/closing'))
      }
    })
  }

  const currentListProps = {
    item
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Shift" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shiftId', {
              initialValue: item && item.shift ? item.shift.shiftName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Cashier" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userId', {
              initialValue: item && item.user ? item.user.userName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Close Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('closed', {
              initialValue: item && item.closed ? moment(item.closed).format('DD-MMM-YYYY HH:mm:ss') : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Assign To" hasFeedback {...formItemLayout}>
            {getFieldDecorator('approveUserId', {
              initialValue: item && item.approveUser ? item.approveUser.userName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Memo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item && item.description ? item.description : undefined
            })(<Input disabled maxLength={255} />)}
          </FormItem>
          <CurrentList {...currentListProps} />
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormComponent.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  showCities: PropTypes.func,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func
}

export default Form.create()(FormComponent)
