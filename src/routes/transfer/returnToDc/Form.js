import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal } from 'antd'
import ListItem from './ListItem'

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  loading,
  selectedTransfer,
  onSubmit,
  onShowProduct,
  listItemProps,
  button,
  onSearchTransfer,
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
        offset: 19
      },
      sm: {
        offset: 20
      },
      md: {
        offset: 19
      },
      lg: {
        offset: 18
      }
    }
  }

  const handleSearchTransfer = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onSearchTransfer(data.transNo)
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Trans No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: selectedTransfer.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    handleSearchTransfer()
                  }
                }
              }
              disabled={selectedTransfer && selectedTransfer.id}
              maxLength={50}
              autoFocus
            />)}
          </FormItem>

        </Col>
      </Row>
      {selectedTransfer && selectedTransfer.id && <Button type="primary" style={{ marginBottom: '10px' }} onClick={onShowProduct}>Product</Button>}
      {selectedTransfer && selectedTransfer.id ? (
        <ListItem {...listItemProps} />
      ) : null}

      {selectedTransfer && selectedTransfer.id ? (
        <Button disabled={loading.effects['returnToDc/add']} type="primary" style={{ float: 'right', marginTop: '10px' }} onClick={handleSubmit}>{button}</Button>
      ) : (
        <Row>
          <Col {...column}>
            <FormItem {...tailFormItemLayout}>
              <Button type="default" disabled={loading.effects['returnToDc/queryTransferOut'] || loading.effects['returnToDc/queryTransferOutDetail']} onClick={handleSearchTransfer}>Search</Button>
            </FormItem>
          </Col>
        </Row>
      )}
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
