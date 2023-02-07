import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalEntry = ({
  onOk,
  listEmployee,
  detailData,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const data = getFieldsValue()
      Modal.confirm({
        title: 'Add Employee as PIC',
        content: 'Are you sure ?',
        onOk () {
          onOk(data, resetFields)
        }
      })
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const childrenEmployee = listEmployee && listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []

  return (
    <Modal {...modalOpts}>
      <Form>
        {detailData && detailData.batch && detailData.activeBatch && (detailData.activeBatch.batchNumber === 2 || detailData.activeBatch.batchNumber === 3) && !detailData.activeBatch.status ? null : (
          <Form layout="horizontal">
            <FormItem label="PIC" hasFeedback {...formItemLayout}>
              {getFieldDecorator('userId', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  showSearch
                  allowClear
                  multiple
                  optionFilterProp="children"
                  placeholder="Choose Employee"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >
                  {childrenEmployee}
                </Select>
              )}
            </FormItem>
          </Form>
        )}
      </Form>
    </Modal>
  )
}

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEntry)
