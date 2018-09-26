import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, Select } from 'antd'
import ListTree from './ListTree'

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

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  listCategory,
  showCategories,
  productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : [],
  button,
  listProps,
  getItemById,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const editItemById = (id) => {
    getItemById(id)
    resetFields()
  }
  const listOpts = {
    editItemById,
    ...listProps
  }
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
      data.categoryName = data.categoryId.label
      data.categoryId = data.categoryId.key
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

  const category = () => {
    showCategories()
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Category" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryId', {
              initialValue: item.categoryId ? {
                key: item.categoryId,
                label: item.categoryName
              } : {},
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              allowClear
              disabled={modalType === 'edit'}
              onFocus={() => category()}
              optionFilterProp="children"
              labelInValue
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >{productCategory}
            </Select>)}
          </FormItem>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <ListTree {...listOpts} />
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  listCategory: PropTypes.array.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
