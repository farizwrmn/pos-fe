import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { lstorage, alertModal } from 'utils'
import { Form, Input, Checkbox, InputNumber, Select, DatePicker, Button, Row, Col, Modal } from 'antd'
import { prefix } from 'utils/config.main'
import { getVATPercentage } from 'utils/tax'
import ListItem from './ListItem'

const { checkPermissionMonthTransaction } = alertModal

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
  md: {
    span: 24,
    offset: 0
  },
  lg: {
    span: 8,
    offset: 0
  }
}

const FormCounter = ({
  item = {},
  onSubmit,
  loading,
  onGetProduct,
  listSupplier,
  listItemProps,
  onChangeTotalData,
  listItem,
  onGetReceive,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFields,
    setFieldsValue,
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
        ...item,
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      if (data.transDate) {
        data.transDate = moment(data.transDate).format('YYYY-MM-DD')
      }
      if (data.taxDate) {
        data.taxDate = moment(data.taxDate).format('YYYY-MM-DD')
      }
      if (data.dueDate) {
        data.dueDate = moment(data.dueDate).format('YYYY-MM-DD')
      }
      const startPeriod = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).startPeriod : {}
      const transDate = moment(data.transDate).format('YYYY-MM-DD')
      const formattedStartPeriod = moment(startPeriod).format('YYYY-MM-DD')

      const checkPermission = checkPermissionMonthTransaction(transDate)
      if (checkPermission) {
        return
      }
      if (transDate >= formattedStartPeriod) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit({
              discInvoiceNominal: data.discInvoiceNominal,
              discInvoicePercent: data.discInvoicePercent,
              transDate: data.transDate,
              taxDate: data.taxDate,
              taxInvoice: data.taxInvoice,
              taxInvoiceNo: data.taxInvoiceNo,
              taxType: data.taxType,
              dueDate: data.dueDate,
              reference: data.reference,
              nettoTotal: data.nettoTotal,
              rounding: data.rounding,
              purchaseReceiveId: data.purchaseReceiveId,
              purchaseOrderId: data.purchaseOrderId,
              storeId: lstorage.getCurrentUserStore(),
              supplierId: data.supplierId,
              tempo: data.tempo,
              deliveryFee: data.deliveryFee,
              transNo: data.transNo
            }, resetFields)
          },
          onCancel () { }
        })
      } else {
        Modal.warning({
          title: 'Period has been closed',
          content: 'This period has been closed'
        })
      }
    })
  }

  const onChangeSupplier = (supplierId) => {
    const supplier = listSupplier.filter(supplier => supplier.id === supplierId)
    if (supplier && supplier.length === 1) {
      setFieldsValue({
        tempo: supplier[0].paymentTempo
      })
    }
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

  const showModalReceive = () => {
    const data = {
      ...item,
      ...getFieldsValue()
    }
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        onGetReceive(data)
        resetFields()
      },
      onCancel () {

      }
    })
  }

  const showModalProduct = () => {
    const data = {
      ...item,
      ...getFieldsValue()
    }
    onGetProduct(data)
  }

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...col}>
          <h1>Invoice Info</h1>
          <FormItem label="No. Trans" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled maxLength={20} />)}
          </FormItem>
          <FormItem label="Reference" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reference', {
              initialValue: item.reference,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input maxLength={30} />)}
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
              onChange={onChangeSupplier}
              disabled={item.supplierId && item.receiveItem}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
          <FormItem label="Invoice Date" {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: item.transDate ? moment.utc(item.transDate, 'YYYY-MM-DD') : moment(),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker disabled={item.supplierId && item.receiveItem} allowClear={false} />)}
          </FormItem>
          <FormItem label="Tempo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tempo', {
              initialValue: item.tempo || 30,
              rules: [{
                required: true,
                message: 'Required',
                pattern: /^\d+$/gi
              }]
            })(<InputNumber min={0} maxLength={5} />)}
          </FormItem>
          <FormItem label="Due Date" {...formItemLayout}>
            {getFieldDecorator('dueDate', {
              initialValue: getFieldValue('transDate')
                ? moment(getFieldValue('transDate')).add(getFieldValue('tempo') !== '' && getFieldValue('tempo') != null && getFieldValue('tempo') !== '0' ? Number(getFieldValue('tempo')) : 0, 'days')
                : moment().add(getFieldValue('tempo') !== '' && getFieldValue('tempo') != null && getFieldValue('tempo') !== '0' ? Number(getFieldValue('tempo')) : 0, 'days'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker disabled />)}
          </FormItem>
        </Col>
        <Col {...col}>
          <h1>Additional Cost/Discount</h1>
          <FormItem label="Disc (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discInvoicePercent', {
              initialValue: item.discInvoicePercent || 0,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{0,3})$/i,
                  message: 'Invalid discount'
                }
              ]
            })(
              <InputNumber onBlur={onChangeTotal} min={0} max={100} step={1} style={{ width: '100%' }} />
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
          <FormItem label="Rounding" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rounding', {
              initialValue: item.rounding || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber onBlur={onChangeTotal} style={{ width: '100%' }} />
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
                  required: false
                }
              ]
            })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 5 }} />)}
          </FormItem>
        </Col>
        <Col {...col}>
          <h1>Tax Info</h1>
          <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxType', {
              initialValue: item.taxType || 'E',
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
          <FormItem label="Is Tax Invoice" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxInvoice', {
              valuePropName: 'checked'
            })(<Checkbox />)}
          </FormItem>
          <FormItem label="Tax Invoice" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxInvoiceNo', {
              rules: [{
                required: getFieldValue('taxInvoice'),
                message: 'Required',
                pattern: /^[a-z0-9./-]{6,25}$/i
              }]
            })(<Input maxLength={25} placeholder="Tax Invoice No" />)}
          </FormItem>
          <FormItem label="Tax Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxDate', {
              rules: [{
                required: getFieldValue('taxInvoice'),
                message: 'Required'
              }]
            })(<DatePicker placeholder="Tax Date" />)}
          </FormItem>
        </Col>
      </Row>
      {item && !item.addProduct && <Button type="primary" size="large" onClick={() => showModalReceive()} style={{ marginRight: '10px' }}>Receive</Button>}
      <Button type="default" size="large" onClick={() => showModalProduct()}>Product</Button>
      <ListItem {...listItemProps} rounding={getFieldValue('rounding') || 0} deliveryFee={getFieldValue('deliveryFee') || 0} onModalVisible={record => onShowModal(record)} style={{ marginTop: '10px' }} />
      <Button type="primary" onClick={handleSubmit} style={{ float: 'right', marginTop: '10px' }} disabled={loading.effects['purchaseInvoice/add']}>Save</Button>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
