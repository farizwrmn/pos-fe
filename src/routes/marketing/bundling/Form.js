import React from 'react'
import PropTypes from 'prop-types'
import { Form, Collapse, Input, Button, Row, Col, Tree, Select, DatePicker, TimePicker, Checkbox, Modal } from 'antd'

const Panel = Collapse.Panel
const Option = Select.Option
const TreeNode = Tree.TreeNode
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

const FormCounter = ({
  item = {},
  listAllStores = [],
  onSubmit,
  onCancel,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
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
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/]{3,9}$/i
                }
              ]
            })(<Input maxLength={50} autoFocus />)}
          </FormItem>
          <FormItem label="Promo Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Start Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startDate', {
              initialValue: item.startDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker allowClear />)}
          </FormItem>
          <FormItem label="End Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('endDate', {
              initialValue: item.endDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker allowClear />)}
          </FormItem>
          <FormItem label="Start Hour" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startHour', {
              initialValue: item.startDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker allowClear />)}
          </FormItem>
          <FormItem label="End Hour" hasFeedback {...formItemLayout}>
            {getFieldDecorator('endHour', {
              initialValue: item.endHour,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker allowClear />)}
          </FormItem>
          <FormItem label="Available Days" hasFeedback {...formItemLayout}>
            {getFieldDecorator('availableDate', {
              initialValue: item.availableDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select>
              <Option value="0">Sunday</Option>
              <Option value="1">Monday</Option>
              <Option value="2">Tuesday</Option>
              <Option value="3">Wednesday</Option>
              <Option value="4">Thursday</Option>
              <Option value="5">Friday</Option>
              <Option value="6">Saturday</Option>
            </Select>)}
          </FormItem>
          <FormItem label="Available Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('availableStore', {
              initialValue: item.availableStore,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Collapse>
                <Panel header="List of available Store" key="1">
                  <Tree
                    checkable
                    checkStrictly
                    autoExpandParent
                    defaultExpandAll
                  >
                    {renderTreeNodes(listAllStores)}
                  </Tree>
                </Panel>
              </Collapse>
            )}
          </FormItem>
          <FormItem label="Available Multiple" hasFeedback {...formItemLayout}>
            {getFieldDecorator('availableMultiple', {
              initialValue: item.availableMultiple,
              rules: [
                {
                  required: true
                }
              ]
            })(<Checkbox />)}
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
