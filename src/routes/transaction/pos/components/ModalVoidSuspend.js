import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Modal, Button } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  paymentOpt = (localStorage.getItem('bundle_promo') ?
    JSON.parse(localStorage.getItem('bundle_promo')) : [] || []).length > 0 ?
    (localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []).map(c => <Option value={c.bundeId} key={c.bundeId}>{`${c.name} (${c.code})`}</Option>) : [],
  onCancelList,
  onVoidItem,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...formEditProps
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const handleCancel = () => {
    onCancelList()
  }
  const handleDelete = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      console.log('data')
      Modal.confirm({
        title: `Delete ${data.bundleId}`,
        content: 'Are you sure ?',
        onOk () {
          onVoidItem(data.bundleId)
          resetFields()
        }
      })
    })
  }
  const modalOpts = {
    ...formEditProps
  }
  return (
    <Modal title="Choose the bundle you want to void"
      {...modalOpts}
      footer={[
        <Button size="large" key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button size="large" key="delete" type="danger" onClick={handleDelete}>
          Void
        </Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Bundle" hasFeedback {...formItemLayout}>
          {getFieldDecorator('bundleId', {
            rules: [{
              required: true
            }]
          })(<Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            filterOption={filterOption}
          >{paymentOpt}
          </Select>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancelList: PropTypes.func.isRequired,
  onVoidItem: PropTypes.func.isRequired
}

export default Form.create()(modal)
