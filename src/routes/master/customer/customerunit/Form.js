import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, InputNumber, Button, Row, Col, Collapse, message, Modal, Select } from 'antd'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomerType = ({
  item,
  onSubmit,
  onCancelUpdate,
  modalType,
  openModal,
  disabled,
  customerInfo,
  onFocusBrand,
  onSelectBrand,
  onFocusModel,
  onSelectModel,
  onFocusType,
  onSelectType,
  listBrand,
  listModel,
  listType,
  resetCars,
  button,
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
      if (data.memberCode) {
        other.merk = other.merk.label
        other.model = other.model.label
        if (other.type) other.type = other.type.label
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

  let brands = []
  let models = []
  let types = []
  if (listBrand) brands = listBrand.map(x => (<Option title={x.brandName} key={x.id}>{x.brandName}</Option>))
  if (listModel) models = listModel.map(x => (<Option title={x.modelName} key={x.id}>{x.modelName}</Option>))
  if (listType) types = listType.map(x => (<Option title={x.typeName} key={x.id}>{x.typeName}</Option>))

  const info = (
    <div>
      <FormItem label="Member Code" {...formItemLayout} >
        {getFieldDecorator('memberCode', {
          initialValue: customerInfo.memberCode
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Name" {...formItemLayout}>
        {getFieldDecorator('memberName', {
          initialValue: customerInfo.memberName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="BirthDate" {...formItemLayout}>
        {getFieldDecorator('birthDate', {
          initialValue: customerInfo.birthDate ? moment(customerInfo.birthDate).format('MMMM Do YYYY') : ''
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="City" {...formItemLayout}>
        {getFieldDecorator('cityName', {
          initialValue: customerInfo.cityName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Address" {...formItemLayout}>
        {getFieldDecorator('address01', {
          initialValue: customerInfo.address01
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Type" {...formItemLayout}>
        {getFieldDecorator('memberTypeName', {
          initialValue: customerInfo.memberTypeName
        })(<Input disabled />)}
      </FormItem>
    </div>
  )

  const collapseActiveKey = '1'
  const collapseTitle = customerInfo.memberCode ? `Customer Info(${customerInfo.memberCode})` : 'Customer Info'

  // let y = moment(new Date()).format('YYYY').split('')
  // let pattern = `^(1769|18\\d\\d|19\\d\\d|[2-${y[0]}][0-${y[1]}][0-${y[2]}][0-${y[3]}])$`
  // let yearPattern = new RegExp(pattern)

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

  const getMerk = { key: item.merk, label: item.merk }
  const getModel = { key: item.model, label: item.model }
  const getType = { key: item.type, label: item.type }
  const getTypeNull = undefined

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Member Code" hasFeedback {...formItemLayout}>
            <Button disabled={disabled} type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
          </FormItem>
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
            })(<Input disabled={disabled} maxLength={10} autoFocus />)}
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
            })(<InputNumber maxLength={4} min={1769} max={moment(new Date()).format('YYYY')} />)}
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
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <Collapse defaultActiveKey={collapseActiveKey} >
            <Panel header={collapseTitle} key="1">
              {info}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Form>
  )
}

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listItem: PropTypes.object,
  customerInfo: PropTypes.object,
  onSubmit: PropTypes.func,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  modalVisible: PropTypes.bool,
  button: PropTypes.string
}

export default Form.create()(formCustomerType)
