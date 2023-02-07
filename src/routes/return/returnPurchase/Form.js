import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Switch, Select, Button, Row, Col, Modal } from 'antd'
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
  resetListItem,
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
    getFieldsValue,
    getFieldValue,
    resetFields,
    setFieldsValue
  },
  reference,
  referenceNo,
  listProps
}) => {
  const handleInvoice = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      resetFields(['reference', 'referenceNo'])
      data.supplierId = data.supplierCode.key
      handleInvoiceBrowse({
        supplierCode: data.supplierId
      })
    })
  }
  // const {  } = modalProductProps
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue(),
        referenceNo: getFieldValue('requireInvoice') ? getFieldValue('referenceNo') : null,
        reference: getFieldValue('requireInvoice') ? getFieldValue('reference') : null
      }
      data.supplierId = data.supplierCode.key
      Modal.confirm({
        title: 'Save this transaction',
        content: 'Are you sure?',
        onOk () {
          onSubmit(data, listItem, resetFields)
        },
        onCancel () {
          // cancel
        }
      })
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

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  const handleChangeSupplier = () => {
    const oldSupplierCode = getFieldValue('supplierCode')
    validateFields(['supplierCode'], (errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          const type = getFieldValue('type')
          resetListItem(type)
        },
        onCancel () {
          setFieldsValue({
            supplierCode: {
              key: oldSupplierCode ? oldSupplierCode.key : null,
              label: oldSupplierCode ? oldSupplierCode.label : null
            }
          })
        }
      })
    })
  }

  const handleChangeInvoice = (checked) => {
    const oldValue = getFieldValue('requireInvoice')
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        handleProductBrowse(true, false, checked)
        resetListItem()
      },
      onCancel () {
        setFieldsValue({
          requireInvoice: oldValue
        })
      }
    })
  }

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
              {getFieldDecorator('supplierCode', {
                initialValue: item.supplierId ? {
                  key: item.supplierId,
                  value: item.supplierId
                } : listSupplier && listSupplier[0] ? {
                  key: listSupplier[0].id,
                  value: listSupplier[0].supplierName
                } : undefined,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                optionFilterProp="children"
                labelInValue
                maxTagCount={5}
                onChange={handleChangeSupplier}
                style={{ width: '100%' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >
                {supplierData}
              </Select>)}
            </FormItem>
            <FormItem label="Required Invoice" hasFeedback {...formItemLayout}>
              {getFieldDecorator('requireInvoice', {
                initialValue: true,
                valuePropName: 'checked',
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Switch defaultChecked onChange={checked => handleChangeInvoice(checked)} />)}
            </FormItem>
            <FormItem label="referenceNo" hasFeedback {...formItemLayout}>
              {getFieldDecorator('referenceNo', {
                initialValue: referenceNo,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reference', {
                initialValue: reference,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
            {getFieldValue('requireInvoice') && (
              <Button size="large" type="default" onClick={() => handleInvoice()} style={{ marginRight: '10px' }}>Invoice</Button>
            )}
            {getFieldValue('requireInvoice') && item && item.referenceNo && item.reference && (
              <Button type="primary" size="large" onClick={() => handleProductBrowse()}>Product</Button>
            )}
            {!getFieldValue('requireInvoice') && (
              <Button type="primary" size="large" onClick={() => handleProductBrowse(true, true)}>Product</Button>
            )}
          </Col>
          <Col {...col}>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>
        <ListItem {...listProps} style={{ marginTop: '10px' }} />
        <FormItem>
          <Button disabled={loadingButton.effects['returnPurchase/add']} size="large" type="primary" onClick={handleSubmit} style={{ marginTop: '8px', float: 'right' }}>{button}</Button>
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
