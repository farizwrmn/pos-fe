import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd'

const { Option } = Select
const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalItem = ({
  listAllStores,
  item,
  modalType,
  listItem,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  onCancel,
  onAddItem,
  onEditItem,
  onDeleteItem,
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
      if (modalType === 'add') {
        onAddItem(data, resetFields)
      } else {
        const exists = listItem.filter(filtered => parseFloat(filtered.storeId) === parseFloat(data.storeId) && parseFloat(filtered.no) !== parseFloat(item.no))
        if (exists && exists[0]) {
          message.error('Store already exists')
        } else {
          onEditItem(data, resetFields)
        }
      }
      // handleProductBrowse()
    })
  }

  const handleCancel = () => {
    onCancel()
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `Delete ${item.storeName}`,
      content: 'Are you sure ?',
      onOk () {
        onDeleteItem(item)
      }
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  let listStore = modalType === 'add' ? (listAllStores.length > 0 ? listAllStores.filter((filtered) => {
    const exists = listItem.filter(storeExists => storeExists.storeId === filtered.id)
    if (exists && exists[0]) {
      return false
    }
    return true
  }).map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>)) : []) : listAllStores.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))

  return (
    <Modal
      {...modalOpts}
      onCancel={onCancel}
      footer={[
        <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
        <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="No" hasFeedback {...formItemLayout}>
          {getFieldDecorator('no', {
            initialValue: modalType === 'add' ? listItem.length + 1 : item.no,
            rules: [{
              required: true
            }]
          })(<Input disabled maxLength={10} />)}
        </FormItem>

        <FormItem
          label="Store"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('storeId', {
            initialValue: item.storeId,
            rules: [{
              required: true
            }]
          })(
            <Select
              mode={modalType === 'add' ? 'multiple' : 'default'}
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose StoreId"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listStore}
            </Select>
          )}
        </FormItem>

        <FormItem label="Deposit" hasFeedback {...formItemLayout}>
          {getFieldDecorator('depositTotal', {
            initialValue: item.depositTotal,
            rules: [{
              required: true
            }]
          })(
            <InputNumber
              style={{ width: '100%' }}
              value={0}
              min={0}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleOk()
                }
              }}
            />
          )}
        </FormItem>

        <FormItem label="Description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [{
              required: false
            }]
          })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalItem.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalItem)
