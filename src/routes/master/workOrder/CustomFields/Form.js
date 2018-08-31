import React from 'react'
import { Form, Select, Input, Row, Col, Button, Modal } from 'antd'
import List from './List'

const FormItem = Form.Item
const Option = Select.Option

const formCol = {
  xs: 24,
  sm: 12,
  md: 11,
  lg: 10
}

const treeCol = {
  xs: 24,
  sm: 12,
  md: 9,
  lg: 9
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 5 },
    md: { span: 5 },
    lg: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 17 },
    md: { span: 18 },
    lg: { span: 15 }
  }
}

const FormField = ({
  formType,
  list,
  item,
  listProps,
  cancelEdit,
  submitItem,
  updateCurrentItem,
  form: {
    getFieldsValue,
    getFieldDecorator,
    resetFields,
    validateFields
  }
}) => {
  const { editField } = listProps
  const onEdit = (item) => {
    editField(item)
    resetFields()
  }

  const onCancel = () => {
    cancelEdit()
    resetFields()
  }

  const onSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (!data.sortingIndex) delete data.sortingIndex
      else data.sortingIndex = item.sortingIndex
      if (data.fieldParentId) data.fieldParentId = Number(data.fieldParentId)
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          submitItem(data)
          resetFields()
        },
        onCancel () { }
      })
    })
  }

  const treeProps = {
    onEdit,
    ...listProps
  }

  const changeSort = (value) => {
    if (value) {
      let sort = list.find(x => x.id === value)
      updateCurrentItem(sort.sortingIndex)
    }
  }

  const groups = (list && list.length) ? list.filter(x => x.fieldParentId === '').map(x => (<Option value={x.id.toString()}>{x.fieldName}</Option>)) : []
  let sorts = []
  if (formType === 'edit') sorts = (list && list.length) ? list.filter(x => x.fieldParentId === item.fieldParentId && x.id !== item.id).map(x => (<Option value={x.id}>{x.fieldName}</Option>)) : []

  return (
    <Row>
      <Col {...formCol}>
        <Form layout="horizontal">
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('fieldName', {
              initialValue: item.fieldName,
              rules: [{ required: true }]
            })(<Input maxLength={21} />)}
          </FormItem>
          <FormItem label="Order" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sortingIndex')(<Select
              disabled={(formType === 'add')}
              optionFilterProp="children"
              allowClear
              onChange={changeSort}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {sorts}
            </Select>)}
          </FormItem>
          <FormItem label="Groups" hasFeedback {...formItemLayout}>
            {getFieldDecorator('fieldParentId', {
              initialValue: item.fieldParentId ? item.fieldParentId.toString() : null
            })(<Select
              disabled={formType === 'edit'}
              optionFilterProp="children"
              allowClear
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {groups}
            </Select>)}
          </FormItem>
          <Row>
            <Col xs={24} sm={22} md={23} lg={20}>
              <FormItem style={{ float: 'right' }}>
                {formType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={onCancel}>Cancel</Button>}
                <Button type="primary" onClick={onSubmit}>{formType === 'edit' ? 'Update' : 'Save'}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col {...treeCol}>
        <List {...treeProps} />
      </Col>
    </Row>
  )
}

export default Form.create()(FormField)
