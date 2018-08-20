import React from 'react'
import moment from 'moment'
import { Form, Input, InputNumber, Select, Modal, message, Button, DatePicker } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { MonthPicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const FormUnit = ({
  modalType,
  customerInfo,
  item,
  addUnit,
  listBrand,
  listModel,
  listType,
  onFocusBrand,
  onFocusModel,
  onFocusType,
  onSelectBrand,
  onSelectModel,
  onSelectType,
  onCancelUpdate,
  confirmSendUnit,
  cancelUnit,
  resetCars,
  button,
  onSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
    validateFields
  }
}) => {
  const getMerk = { key: item.merk, label: item.merk }
  const getModel = { key: item.model, label: item.model }
  const getType = { key: item.type, label: item.type }
  const getTypeNull = undefined

  let brands = []
  let models = []
  let types = []
  if (listBrand) brands = listBrand.map(x => (<Option title={x.brandName} key={x.id}>{x.brandName}</Option>))
  if (listModel) models = listModel.map(x => (<Option title={x.modelName} key={x.id}>{x.modelName}</Option>))
  if (listType) types = listType.map(x => (<Option title={x.typeName} key={x.id}>{x.typeName}</Option>))

  const chooseBrand = (value) => {
    onSelectBrand(value)
    if (modalType === 'edit') {
      item.model = undefined
      item.type = undefined
    }
    resetFields(['model', 'type'])
  }

  const chooseModel = (value) => {
    onSelectModel(value)
    resetFields(['type'])
  }

  const chooseType = (value) => {
    onSelectType(value)
  }

  let y = moment().format('YYYY')

  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const sendUnit = () => {
    const data = { ...getFieldsValue() }
    data.memberCode = addUnit.info.id
    data.merk = data.merk.label
    data.model = data.model.label
    if (data.type) data.type = data.type.label
    confirmSendUnit(data)
  }

  const cancelSendUnit = () => {
    cancelUnit()
  }

  const handleCancel = () => {
    onCancelUpdate()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }

      const { memberName, memberTypeName, birthDate, cityName, address01, ...other } = data

      if (customerInfo.memberCode) {
        other.memberCode = customerInfo.memberCode
        other.merk = other.merk.label
        other.model = other.model.label
        if (other.type) other.type = other.type.label
        other.expired = moment(other.expired).endOf('day').format('YYYY-MM-DD')
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(other)
            resetFields()
            resetCars()
          },
          onCancel () { }
        })
      } else {
        message.warning("Member Code can't be null")
      }
    })
  }

  return (
    <Form>
      <FormItem label="Police No" hasFeedback {...formItemLayout}>
        {getFieldDecorator('policeNo', {
          initialValue: item.policeNo,
          rules: [
            {
              required: true,
              pattern: /^[A-Z0-9]{1,10}\S+$/,
              message: 'A-Z & 0-9'
            }
          ]
        })(<Input disabled={modalType === 'edit'} maxLength={10} autoFocus />)}
      </FormItem>
      <FormItem label="Merk" hasFeedback {...formItemLayout}>
        {getFieldDecorator('merk', {
          initialValue: item.merk ? getMerk : item.merk,
          valuePropName: 'value',
          rules: [
            {
              required: true
            }
          ]
        })(<Select
          mode="combobox"
          size="large"
          labelInValue
          style={{ width: '100%' }}
          optionLabelProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onFocus={onFocusBrand}
          onChange={value => chooseBrand(value)}
        >
          {brands}
        </Select>)}
      </FormItem>
      <FormItem label="Model" hasFeedback {...formItemLayout}>
        {getFieldDecorator('model', {
          initialValue: item.model ? getModel : item.model,
          valuePropName: 'value',
          rules: [
            {
              required: true
            }
          ]
        })(<Select
          mode="combobox"
          size="large"
          labelInValue
          style={{ width: '100%' }}
          optionLabelProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onFocus={onFocusModel}
          onChange={value => chooseModel(value)}
        >
          {models}
        </Select>)}
      </FormItem>
      <FormItem label="Tipe" hasFeedback {...formItemLayout}>
        {getFieldDecorator('type', {
          initialValue: item.type ? getType : getTypeNull,
          valuePropName: 'value'
        })(<Select
          mode="combobox"
          size="large"
          labelInValue
          style={{ width: '100%' }}
          optionLabelProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onFocus={onFocusType}
          onChange={value => chooseType(value)}
        >
          {types}
        </Select>)}
      </FormItem>
      <FormItem label="Tahun" hasFeedback {...formItemLayout}>
        {getFieldDecorator('year', {
          initialValue: item.year
        })(<InputNumber maxLength={4} min={1769} max={y} />)}
      </FormItem>
      <FormItem label="No Rangka" hasFeedback {...formItemLayout}>
        {getFieldDecorator('chassisNo', {
          initialValue: item.chassisNo
        })(<Input maxLength={20} />)}
      </FormItem>
      <FormItem label="No Mesin" hasFeedback {...formItemLayout}>
        {getFieldDecorator('machineNo', {
          initialValue: item.machineNo
        })(<Input maxLength={20} />)}
      </FormItem>
      <FormItem label="Expiration Month" hasFeedback {...formItemLayout}>
        {getFieldDecorator('expired', {
          initialValue: item.expired ? moment(item.expired, 'YYYY-MM-DD') : null
        })(<MonthPicker format="MMM-YYYY" placeholder="Select period" />)}
      </FormItem>
      {(modalType === 'edit' || modalType === 'add') &&
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" onClick={handleSubmit}>{button}</Button>
        </FormItem>}
      {modalType === 'addUnit' && <div style={{ textAlign: 'right' }}>
        <Button type="danger" style={{ margin: '0 10px' }} onClick={cancelSendUnit}>Cancel</Button>
        <Button type="primary" onClick={sendUnit}>Save</Button>
      </div>}
    </Form>
  )
}

export default Form.create()(FormUnit)
