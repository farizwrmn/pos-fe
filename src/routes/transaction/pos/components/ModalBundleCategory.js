import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Modal, Button } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalBundleCategory = ({
  onCancel,
  onOk,
  dataReward,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...formEditProps
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const handleCancel = () => {
    onCancel()
  }
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data && data.bundle) {
        data.bundle = data.bundle.map((item, index) => {
          const filteredProduct = dataReward[index].listItem.filter(filtered => filtered.id === item.key)
          if (filteredProduct && filteredProduct[0]) {
            return ({
              ...item,
              reward: dataReward[index],
              item: filteredProduct[0]
            })
          }
          return null
        }).filter(filtered => filtered)
      }
      onOk(data, resetFields)
    })
  }

  return (
    <Modal title="Choose Bundle Items"
      onCancel={loading ? () => { } : onCancel}
      {...formEditProps}
      footer={[
        <Button disabled={loading} size="large" key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      ]}
    >
      <Form layout="vertical">
        {dataReward && dataReward.map((data) => {
          if (data.item.type === 'P') {
            return (
              <FormItem label={data.label.productName} hasFeedback {...formItemLayout}>
                {getFieldDecorator(`bundle[${data.key}]`, {
                  initialValue: data.initialValue && data.initialValue.key ? {
                    key: data.initialValue.key,
                    label: data.initialValue.label
                  } : undefined,
                  rules: [{
                    required: true
                  }]
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  labelInValue
                  disabled={loading}
                  filterOption={filterOption}
                >{
                    data.listItem && data.listItem
                      .map(c => <Option value={c.id} key={c.id} title={`${c.productCode} - ${c.productName}`}>{c.productName}</Option>)
                  }
                </Select>)}
              </FormItem>
            )
          }
          if (data.item.type === 'S') {
            return (
              <FormItem label={data.label.productName} hasFeedback {...formItemLayout}>
                {getFieldDecorator(`bundle[${data.key}]`, {
                  initialValue: data.initialValue && data.initialValue.key ? {
                    key: data.initialValue.key,
                    label: data.initialValue.label
                  } : undefined,
                  rules: [{
                    required: true
                  }]
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  labelInValue
                  disabled={loading}
                  filterOption={filterOption}
                >{
                    data.listItem && data.listItem
                      .map(c => <Option value={c.id} key={c.id} title={`${c.serviceCode} - ${c.serviceName}`}>{`${c.serviceName} (${c.serviceCode})`}</Option>)
                  }
                </Select>)}
              </FormItem>
            )
          }
          return null
        }).filter(filtered => filtered)}
      </Form>
    </Modal>
  )
}

ModalBundleCategory.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancelList: PropTypes.func.isRequired,
  onVoid: PropTypes.func.isRequired
}

export default Form.create()(ModalBundleCategory)
