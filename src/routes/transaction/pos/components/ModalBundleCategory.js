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
  listProduct,
  onCancel,
  onOk,
  dataReward,
  currentCategory,
  currentReward,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...formEditProps
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const handleCancel = () => {
    onCancel()
  }
  const handleDelete = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data && data.bundle) {
        data.bundle = data.bundle.map((item) => {
          const filteredProduct = listProduct.filter(filtered => filtered.id === item.key)
          if (filteredProduct && filteredProduct[0]) {
            return ({
              ...item,
              item: filteredProduct[0]
            })
          }
          return null
        })
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
        <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleDelete}>
          Submit
        </Button>
      ]}
    >
      <Form layout="vertical">
        {currentReward === 'P' && dataReward && dataReward.map((data) => {
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
                  listProduct && listProduct
                    .filter(filtered => filtered.count > 0)
                    .map(c => <Option value={c.id} key={c.id} title={`${c.productCode} - ${c.productName}`}>{`${c.productName} (${c.productCode})`}</Option>)
                }
              </Select>)}
            </FormItem>
          )
        })}

        {currentReward === 'S' && dataReward && dataReward.map((data) => {
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
                  listProduct && listProduct
                    .map(c => <Option value={c.id} key={c.id} title={`${c.serviceCode} - ${c.serviceName}`}>{`${c.serviceName} (${c.serviceCode})`}</Option>)
                }
              </Select>)}
            </FormItem>
          )
        })}
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
