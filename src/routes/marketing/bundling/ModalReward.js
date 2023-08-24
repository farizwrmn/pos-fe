import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Checkbox, Modal, Button } from 'antd'
import { posTotal } from 'utils'
import { getDistPriceName, getDistPricePercent, getDistPriceDescription } from 'utils/string'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 }
}

const ModalReward = ({
  item,
  onOkList,
  onCancelList,
  onDeleteItem,
  form: { getFieldDecorator, setFieldsValue, validateFields, getFieldsValue, getFieldValue, resetFields },
  ...formEditProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.no = item.no
      data.id = item.id
      data.type = item.type
      data.categoryCode = item.categoryCode
      data.productId = item.productId
      data.productCode = item.productCode
      data.productName = item.productName
      data.sellingPrice = data.sellPrice
      data.sellPrice = data.sellPrice
      data.discount = 0
      data.disc1 = 0
      data.disc2 = 0
      data.disc3 = 0
      data.total = posTotal(data)
      onOkList(data)
    })
  }
  const handleCancel = () => {
    onCancelList()
  }
  const handleDelete = () => {
    Modal.confirm({
      title: `Delete ${item.productName}`,
      content: 'Are you sure ?',
      onOk () {
        onDeleteItem(item.no - 1)
        resetFields()
      }
    })
  }
  const modalOpts = {
    ...formEditProps,
    onOk: handleOk
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

  return (
    <Modal title={`Reward for ${item.productCode} - ${item.productName}`}
      {...modalOpts}
      footer={[
        <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
        <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Qty" hasFeedback {...formItemLayout}>
          {getFieldDecorator('qty', {
            initialValue: item.qty,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('sellPrice')} help={getDistPriceDescription('sellPrice')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('sellPrice', {
            initialValue: item.sellPrice,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <Button type="primary" size="small" onClick={() => onDistPrice()}>Auto Fill</Button>
        <FormItem label={getDistPriceName('distPrice01')} help={getDistPriceDescription('distPrice01')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice01', {
            initialValue: item.distPrice01,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice02')} help={getDistPriceDescription('distPrice02')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice02', {
            initialValue: item.distPrice02,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice03')} help={getDistPriceDescription('distPrice03')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice03', {
            initialValue: item.distPrice03,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice04')} help={getDistPriceDescription('distPrice04')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice04', {
            initialValue: item.distPrice04,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice05')} help={getDistPriceDescription('distPrice05')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice05', {
            initialValue: item.distPrice05,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice06')} help={getDistPriceDescription('distPrice06')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice06', {
            initialValue: item.distPrice06,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice07')} help={getDistPriceDescription('distPrice07')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice07', {
            initialValue: item.distPrice07,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice08')} help={getDistPriceDescription('distPrice08')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice08', {
            initialValue: item.distPrice08,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice09')} help={getDistPriceDescription('distPrice09')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice09', {
            initialValue: item.distPrice09,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Can Be Replace" {...formItemLayout}>
          {getFieldDecorator('replaceable', {
            valuePropName: 'checked',
            initialValue: item.replaceable === undefined
              ? false
              : item.replaceable
          })(<Checkbox>Can Be Replace</Checkbox>)}
        </FormItem>
        <FormItem label="Hide" {...formItemLayout}>
          {getFieldDecorator('hide', {
            valuePropName: 'checked',
            initialValue: item.hide === undefined
              ? true
              : item.hide
          })(<Checkbox>Hide</Checkbox>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalReward.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalReward)
