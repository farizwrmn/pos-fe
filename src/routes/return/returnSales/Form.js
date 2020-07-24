import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col } from 'antd'
// import { lstorage } from 'utils'
import ListItem from './ListItem'
// import ModalConfirm from './ModalConfirm'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 9
  }
}

const col = {
  lg: {
    span: 12,
    offset: 0
  }
}

const FormAdd = ({
  item = {},
  onSubmit,
  button,
  loadingButton,
  listItem,
  handleProductBrowse,
  handleInvoiceBrowse,
  // formConfirmProps,
  // modalConfirmVisible,
  // modalProductProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  listProps
}) => {
  // const {  } = modalProductProps
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.employeeId = data.employeeId.key
      data.storeId = item.storeId
      data.storeIdReceiver = data.storeIdReceiver.key
      data.reference = item.reference
      onSubmit(data, listItem)
      // handleReset()
    })
  }
  // const formConfirmOpts = {
  //   listItem,
  //   itemHeader: {
  //     storeId: {
  //       label: lstorage.getCurrentUserStoreName()
  //     },
  //     ...getFieldsValue()
  //   },
  //   ...formConfirmProps
  // }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...col}>
            <FormItem label="No. Transfer" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={20} />)}
            </FormItem>
            <FormItem label="reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('referenceNo', {
                initialValue: item.referenceNo,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
            <Button size="large" type="default" onClick={() => handleInvoiceBrowse()} style={{ marginRight: '10px' }}>Invoice</Button>
            {item && item.referenceNo && item.reference && (
              <Button type="primary" size="large" onClick={() => handleProductBrowse()}>Product</Button>
            )}
          </Col>
          <Col {...col}>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>
        <ListItem {...listProps} style={{ marginTop: '10px' }} />
        <FormItem>
          <Button disabled={loadingButton.effects['returnSales/add']} size="large" type="primary" onClick={handleSubmit} style={{ marginTop: '8px', float: 'right' }}>{button}</Button>
        </FormItem>
        {/* {modalConfirmVisible && <ModalConfirm {...formConfirmOpts} />} */}
      </Form>
    </div>
  )
}

FormAdd.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormAdd)
