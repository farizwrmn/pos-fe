import React from 'react'
import { Modal, Select, Button, Form } from 'antd'

const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalCategory = ({
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  item,
  onOk,
  listGrabCategory,
  selectedRowKeys,
  onCancel,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Save this item for selected items',
        content: 'Are you sure ?',
        onOk () {
          data.productId = selectedRowKeys
          data.grabCategoryName = data.grabCategoryId ? data.grabCategoryId.label : null
          data.grabCategoryId = data.grabCategoryId ? data.grabCategoryId.key : null
          onOk(data, resetFields)
        }
      })
      // handleProductBrowse()
    })
  }

  const grabCategory = (listGrabCategory || []).length > 0 ? listGrabCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.subcategoryName}`}>{`${c.categoryName} | ${c.subcategoryName}`}</Option>) : []

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  return (
    <Modal
      {...modalOpts}
      onCancel={onCancel}
      footer={[
        <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Grab Category" hasFeedback {...formItemLayout}>
          {getFieldDecorator('grabCategoryId', {
            initialValue: item.grabCategoryId ? {
              key: item.grabCategoryId,
              label: item.grabCategoryName
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
            labelInValue
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
          >{grabCategory}
          </Select>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalCategory)
