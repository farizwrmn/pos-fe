import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Row, Col, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'
import CurrentList from './CurrentList'

const Option = Select.Option
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
  listShift = [],
  dispatch,
  loading,
  button,
  onSubmit,
  modalType,
  listProps,
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
            console.log('handleSubmit', data)
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
          {item && item.store && (
            <FormItem label="Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeName', {
                initialValue: item.store.storeName,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Input disabled />
              )}
            </FormItem>
          )}
          <FormItem label="Shift" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shiftId', {
              initialValue: item && item.shiftId ? item.shiftId : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select disabled={button === 'Close'}>
                {listShift && listShift.map(item => (<Option value={item.id} key={item.id}>{item.shiftName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Memo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item && item.description ? item.description : undefined
            })(<Input disabled={button === 'Close'} maxLength={255} />)}
          </FormItem>
          {button === 'Open' ? (
            <List
              form={{
                getFieldDecorator
              }}
              {...listProps}
            />
          )
            : (
              <CurrentList {...currentListProps} />
            )}
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" disabled={loading.effects['balance/open']} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormComponent.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func
}

export default Form.create()(FormComponent)
