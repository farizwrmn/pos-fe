import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Row, Col, Modal, TreeSelect } from 'antd'
import { arrayToTree } from 'utils'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  options = [],
  onSubmit,
  onCancel,
  modalType,
  listAccountCodeLov,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const listOptions = (listAccountCodeLov || []).length > 0 ? (listAccountCodeLov || []).map(c => <Option value={c.id} key={c.id}>{c.accountName} ({c.accountCode})</Option>) : []
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
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.accountId = data.accountId ? data.accountId.key : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit({
            ...item,
            ...data
          })
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName}>{getMenus(item.children)}</TreeNode>
      }
      return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName} />
    })
  }

  const menuTree = arrayToTree(options.filter(_ => _.parentId !== '-1').sort((x, y) => x.id - y.id), 'id', 'parentId')

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('paymentOption', {
              initialValue: item.paymentOption ? item.paymentOption : 'C',
              rules: [
                {
                  required: true
                }
              ]
            })(
              // <Select onChange={() => changeMethod()} style={{ width: '100%', fontSize: '14pt' }}>
              //   {options.map(list => <Option value={list.typeCode}>{`${list.typeName} (${list.typeCode})`}</Option>)}
              // </Select>

              <TreeSelect
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeNodeFilterProp="title"
                filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                treeDefaultExpandAll
              >
                {getMenus(menuTree)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={60} />)}
          </FormItem>
          <FormItem label="Account Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountId', {
              initialValue: item && item.accountId && item.accountCode ? {
                key: item.accountId,
                name: `${item.accountCode.accountName || ''} (${item.accountCode.accountCode})`
              } : {},
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Choose Account"
              labelInValue
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{listOptions}
            </Select>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
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
