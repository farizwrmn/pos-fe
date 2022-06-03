import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Row, Col, Modal } from 'antd'
import { lstorage } from 'utils'
import ListItem from './ListItem'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

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
  listSupplier,
  onSubmit,
  button,
  loadingButton,
  listItem,
  handleProductBrowse,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  listProps
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      data.supplierId = data.supplierId
      data.storeId = lstorage.getCurrentUserStore()
      Modal.confirm({
        title: 'Save this transaction',
        content: 'Are you sure?',
        onOk () {
          onSubmit(data, listItem, resetFields)
        },
        onCancel () {
        }
      })
    })
  }


  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...col}>
            <FormItem label="No. Transaction" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={20} />)}
            </FormItem>
            <FormItem required label="Supplier" {...formItemLayout}>
              {getFieldDecorator('supplierId', {
                initialValue: item.supplierId,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >
                {supplierData}
              </Select>)}
            </FormItem>
            <Button type="primary" size="large" onClick={() => handleProductBrowse(true, true)}>Product</Button>
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
              })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>
        <ListItem {...listProps} style={{ marginTop: '10px' }} />
        <FormItem>
          <Button disabled={loadingButton.effects['purchaseOrder/add']} size="large" type="primary" onClick={handleSubmit} style={{ marginTop: '8px', float: 'right' }}>{button}</Button>
        </FormItem>
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
