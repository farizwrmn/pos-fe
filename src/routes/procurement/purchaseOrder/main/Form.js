import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, InputNumber, Select, DatePicker, Button, Row, Col, Modal } from 'antd'
import { getVATPercentage } from 'utils/tax'
import ListItem from './ListItem'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

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

const col = {
  lg: {
    span: 12,
    offset: 0
  }
}

const FormCounter = ({
  item = {},
  onSubmit,
  // onGetProduct,
  onGetQuotation,
  listSupplier,
  listItemProps,
  onChangeTotalData,
  listItem,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const onQuotationClick = () => {
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        onGetQuotation()
        resetFields()
      },
      onCancel () {

      }
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

  const onChangeTotal = () => {
    const data = {
      ...item,
      ...getFieldsValue()
    }
    onChangeTotalData(data, listItem)
  }

  const onShowModal = (record) => {
    const data = {
      ...item,
      ...getFieldsValue()
    }
    listItemProps.onModalVisible(record, data)
  }

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
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
          <FormItem label="Deadline Receive" {...formItemLayout}>
            {getFieldDecorator('expectedArrival', {
              initialValue: item.expectedArrival ? moment.utc(item.expectedArrival, 'YYYY-MM-DD') : moment().add('5', 'days'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker />)}
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
              disabled={item.supplierId}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
          <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxType', {
              initialValue: 'E',
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select onBlur={onChangeTotal}>
              <Option value="I">Include</Option>
              <Option value="E">Exclude (0%)</Option>
              <Option value="S">Exclude ({getVATPercentage()}%)</Option>
            </Select>)}
          </FormItem>
          {/* {item && !item.supplierId && <Button type="default" size="large" onClick={() => onGetProduct()}>Product</Button>} */}
          <Button type="primary" size="large" onClick={() => onQuotationClick()} style={{ marginLeft: '10px' }}>Quotation</Button>
        </Col>
        <Col {...col}>
          <FormItem label="Disc (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discInvoicePercent', {
              initialValue: item.discInvoicePercent || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber onBlur={onChangeTotal} min={0} max={100} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem label="Disc (N)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discInvoiceNominal', {
              initialValue: item.discInvoiceNominal || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber onBlur={onChangeTotal} min={0} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem label="Delivery Fee" hasFeedback {...formItemLayout}>
            {getFieldDecorator('deliveryFee', {
              initialValue: item.deliveryFee || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber onBlur={onChangeTotal} min={0} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true
                }
              ]
            })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 5 }} />)}
          </FormItem>
        </Col>
      </Row>
      <ListItem {...listItemProps} deliveryFee={getFieldValue('deliveryFee') || 0} onModalVisible={record => onShowModal(record)} style={{ marginTop: '10px' }} />
      <Button type="primary" onClick={handleSubmit} style={{ float: 'right', marginTop: '10px' }}>Save</Button>
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
