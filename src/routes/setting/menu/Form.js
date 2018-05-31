import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Row, Col, TreeSelect, Button, Modal } from 'antd'
import List from './List'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 5 },
    md: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 16 },
    md: { span: 17 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormInput = ({
  ...otherProps,
  item,
  menuTree,
  modalType,
  onSubmit,
  onEditItem,
  onCancel,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields
  }
}) => {
  let listProps = {
    ...otherProps,
    menuTree,
    editItem () {
      onEditItem()
      resetFields()
    }
  }
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

  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode value={item.menuId} key={item.menuId} title={item.name}>{getMenus(item.children)}</TreeNode>
      }
      return <TreeNode value={item.menuId} key={item.menuId} title={item.name} />
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
          if (data.route) {
            if (data.route.charAt(0) !== '/') data.route = `/${data.route}`
          }
          if (data.bpid === undefined) data.bpid = null
          if (data.mpid === undefined) data.mpid = null
          if (modalType === 'add') onSubmit(data.menuId, { ...data })
          else onSubmit(item.id, { ...data })
          setTimeout(() => {
            resetFields()
          }, 500)
        },
        onCancel () { }
      })
    })
  }

  const onSelectBPID = (value) => {
    setFieldsValue({ mpid: value })
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  return (
    <Row>
      <Col {...column}>
        <Form layout="horizontal">
          <Row>
            <Col span={24}>
              <FormItem label="Menu ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('menuId', {
                  initialValue: item.menuId,
                  rules: [{ required: true }]
                })(<InputNumber min={0} maxLength={10} style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem label="Icon" hasFeedback {...formItemLayout}>
                {getFieldDecorator('icon', {
                  initialValue: item.icon,
                  rules: [{ required: true }]
                })(<Input maxLength={32} />)}
              </FormItem>
              <FormItem label="Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{ required: true }]
                })(<Input maxLength={50} />)}
              </FormItem>
              <FormItem label="BPID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('bpid', {
                  initialValue: item.bpid
                })(<TreeSelect
                  showSearch
                  allowClear
                  onSelect={value => onSelectBPID(value)}
                  placeholder="Select the BPID"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {getMenus(menuTree)}
                </TreeSelect>)}
              </FormItem>
              <FormItem label="MPID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mpid', {
                  initialValue: item.mpid
                })(<TreeSelect
                  showSearch
                  allowClear
                  placeholder="Select the MPID"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  <TreeNode value="-1" key="-1" title="None" />
                  {getMenus(menuTree)}
                </TreeSelect>)}
              </FormItem>
              <FormItem label="Route" hasFeedback {...formItemLayout}>
                {getFieldDecorator('route', {
                  initialValue: item.route
                })(<Input />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col {...column}>
        <List {...listProps} />
      </Col>
    </Row>
  )
}

FormInput.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object
}

export default Form.create()(FormInput)
