import React, { Component } from 'react'
import { Modal, Button, Form, InputNumber, Select, Spin } from 'antd'
import { getDistPriceName, getDistPricePercent } from 'utils/string'

const FormItem = Form.Item

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalPrice extends Component {
  render () {
    const {
      loading,
      listAllStores,
      form: { getFieldDecorator, getFieldValue, setFieldsValue, validateFields, getFieldsValue, resetFields },
      onOk,
      onCancel,
      item,
      ...modalProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          productId: item.productId,
          storeId: item.storeId,
          ...getFieldsValue()
        }
        data.id = item.id
        Modal.confirm({
          title: 'Apply the change',
          content: 'This action cannot be undone. Are you sure ?',
          onOk () {
            onOk(data, resetFields)
          }
        })
        // handleProductBrowse()
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    const InputNumberProps = {
      placeholder: '0',
      style: { width: '100%' },
      maxLength: 20
    }

    const onDistPrice = () => {
      const sellPrice = getFieldValue('sellPrice')
      if (sellPrice > 0) {
        setFieldsValue({
          distPrice01: (1 + (getDistPricePercent('distPrice01') / 100)) * sellPrice,
          distPrice02: (1 + (getDistPricePercent('distPrice02') / 100)) * sellPrice,
          distPrice03: (1 + (getDistPricePercent('distPrice03') / 100)) * sellPrice,
          distPrice04: (1 + (getDistPricePercent('distPrice04') / 100)) * sellPrice,
          distPrice05: (1 + (getDistPricePercent('distPrice05') / 100)) * sellPrice,
          distPrice06: (1 + (getDistPricePercent('distPrice06') / 100)) * sellPrice,
          distPrice07: (1 + (getDistPricePercent('distPrice07') / 100)) * sellPrice,
          distPrice08: (1 + (getDistPricePercent('distPrice08') / 100)) * sellPrice,
          distPrice09: (1 + (getDistPricePercent('distPrice09') / 100)) * sellPrice
        })
      }
    }

    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
    let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option title={`${x.storeName} (${x.storeCode})`} key={x.id} value={x.id}>{`${x.storeName} (${x.storeCode})`}</Option>)) : []

    return (
      <Modal
        {...modalOpts}
        onCancel={onCancel}
        title={`Update Price ${item.productName.substring(0, 20)}... - ${item.storeName}`}
        footer={[
          <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem
            label="Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('storeId', {
              initialValue: item.storeId,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                size="large"
                placeholder="Select Store"

                showSearch
                allowClear
                optionFilterProp="children"

                multiple
                notFoundContent={loading.effects['userStore/getAllListStores'] ? <Spin size="small" /> : null}
                filterOption={filterOption}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
          <FormItem label="Cost Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('costPrice', {
              initialValue: item.costPrice,
              rules: [
                {
                  required: true,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} disabled />)}
          </FormItem>
          <FormItem label={getDistPriceName('sellPrice')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellPrice', {
              initialValue: item.sellPrice,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <Button type="primary" size="small" onClick={() => onDistPrice()}>Auto Fill</Button>
          <FormItem label={getDistPriceName('distPrice01')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice01', {
              initialValue: item.distPrice01,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice02')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice02', {
              initialValue: item.distPrice02,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice03')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice03', {
              initialValue: item.distPrice03,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice04')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice04', {
              initialValue: item.distPrice04,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice05')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice05', {
              initialValue: item.distPrice05,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice06')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice06', {
              initialValue: item.distPrice06,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice07')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice07', {
              initialValue: item.distPrice07,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice08')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice08', {
              initialValue: item.distPrice08,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice09')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice09', {
              initialValue: item.distPrice09,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalPrice)
