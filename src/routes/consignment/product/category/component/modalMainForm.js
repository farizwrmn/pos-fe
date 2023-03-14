import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

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

const ModalForm = ({
  list,
  modalForm,
  modalType,
  currentItem,
  showModalForm,
  formType,
  onSubmit,
  loading,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const mainCategory = currentItem && currentItem.mainName && list.filter(filtered => filtered.id === currentItem.mainName)[0]

  const categoryOption = list.length > 0 ? list.map(record => <Option key={record.id} value={record.id}>{record.name}</Option>) : []

  const confirm = () => {
    Modal.confirm({
      title: `${String(formType).at(0).toUpperCase() + String(formType).slice(1)} Category`,
      content: `Are you sure to ${formType} this category?`,
      onCancel () {
        showModalForm({ value: null })
      },
      onOk () {
        const fields = getFieldsValue()
        onSubmit(fields)
      }
    })
  }

  return (
    <Modal
      visible={modalForm}
      title="create new category"
      okText="Save"
      onCancel={() => showModalForm({ value: null })}
      onOk={() => confirm()}
      confirmLoading={loading}
    >
      <Form layout="horizontal">
        <FormItem label="Nama" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name || null,
            rules: [
              {
                required: true
              }
            ]
          })(<Input />)}
        </FormItem>
        {modalType === 'sub' && (
          <FormItem label="Kategori Utama" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mainCategory', {
              initialValue: mainCategory ? mainCategory.id : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select>
                {categoryOption}
              </Select>
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(ModalForm)
