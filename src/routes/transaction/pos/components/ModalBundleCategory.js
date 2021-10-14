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
    (localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []).map(c => <Option value={c.bundleId} key={c.bundleId}>{`${c.name} (${c.code})`}</Option>) : [],
  dataBundle = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : [],
  onCancelList,
  onVoid,
  form: { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, resetFields },
  ...formEditProps
}) => {
  const dataBundleFiltered = dataBundle.filter(x => x.bundleId === (getFieldValue('bundleId') ? getFieldValue('bundleId').key : 0))
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
      data.bundleId = data.bundleId.key
      Modal.confirm({
        title: `Delete ${dataBundleFiltered[0] ? dataBundleFiltered[0].name : ''}`,
        content: 'Are you sure ?',
        onOk () {
          onVoid(data.bundleId)
          resetFields()
        }
      })
    })
  }

  return (
    <Modal title="Choose the bundle you want to void"
      {...formEditProps}
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
  onVoid: PropTypes.func.isRequired
}

export default Form.create()(modal)
