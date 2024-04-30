import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Row, Col, Modal, message } from 'antd'
import { lstorage } from 'utils'

const Option = Select.Option
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

const formDivision = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  listDivision,
  listManager,
  // disabled,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
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
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      const data = {
        ...getFieldsValue()
      }
      if (errors) {
        return
      }
      if (data.name) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data, resetFields)
          },
          onCancel () { }
        })
      } else {
        message.warning("name can't be null")
      }
    })
  }
  const handleChange = (value) => {
    const filterMangerUserName = listManager.filter(c => c.id === value)
    if (filterMangerUserName.length) {
      setFieldsValue({
        managerUserName: filterMangerUserName[0].accountName
      })
    }
  }

  // const defaultStore = lstorage.getCurrentUserStore()
  const listStore = lstorage.getListUserStores()
  const listDivisionOption = (listDivision || []).length > 0 ? listDivision.map(c => <Option value={c.id} key={c.id}>{c.name}</Option>) : []
  const listManagerOption = listManager && listManager.length > 0 ? listManager.map(c => <Option key={c.id} value={c.id}>{c.employeeName}</Option>) : []
  const listStoreOption = (listStore || []).length > 0 ? listStore.map(c => <Option value={c.value} key={c.value}>{c.label}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Parent Division" hasFeedback {...formItemLayout}>
            {getFieldDecorator('parentDivisionId', {
              initialValue: item.parentDivisionId
            })(<Select placeholder="Masukkan Parent Divisi" style={{ width: '100%' }} min={0} maxLength={10}>
              {listDivisionOption}
            </Select>)}
          </FormItem>
          <FormItem label="Store Location" hasFeedback {...formItemLayout}>
            {getFieldDecorator('defaultStore', {
              initialValue: item.defaultStore
            })(<Select placeholder="Masukkan Lokasi Store" style={{ width: '100%' }} min={0} maxLength={10}>
              {listStoreOption}
            </Select>)}
          </FormItem>
          <FormItem label="Division Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input placeholder="Masukkan Nama Divisi" />)}
          </FormItem>
          <FormItem label="Manager" hasFeedback {...formItemLayout}>
            {getFieldDecorator('managerUserId', {
              initialValue: item.managerUserId
            })(<Select
              placeholder="Masukkan Nama Manager"
              showSearch
              allowClear
              style={{ width: '100%' }}
              min={0}
              maxLength={10}
              onChange={value => handleChange(value)}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listManagerOption}
            </Select>)}
          </FormItem>
          <FormItem label="Manager Name" hasFeedback {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('managerUserName', {
              initialValue: item.managerUserName
            })(<Input disabled />)}
          </FormItem>
          {/* <FormItem label="Active" hasFeedback {...formItemLayout}>
            {getFieldDecorator('active', {
              initialValue: item.active
            })(<Switch defaultChecked={item.active} />)}
          </FormItem> */}
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

formDivision.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formDivision)
