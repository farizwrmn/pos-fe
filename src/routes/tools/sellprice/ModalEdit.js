import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select } from 'antd'
import { getDistPriceName } from 'utils/string'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalEdit = ({
  currentItemList,
  onOkList,
  onCancelList,
  onDeleteItem,
  listItem,
  selectedRowKeys,
  form: { getFieldDecorator, validateFields, getFieldsValue },
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
      for (let i in data) {
        if (i.substring(0, 6) === 'prefix') {
          const currentSelected = i.substring(6, i.length) || 0
          for (let j in selectedRowKeys) {
            if (data[i] === 'Nominal') {
              const currentItem = data[currentSelected]
              listItem[selectedRowKeys[j] - 1][currentSelected] =
                parseFloat(listItem[selectedRowKeys[j] - 1][currentSelected]) +
                parseFloat(currentItem || 0)
            } else if (data[i] === 'Percent') {
              const currentItem = data[currentSelected]
              const currentPercent = (parseFloat(currentItem || 0) / 100) * parseFloat(listItem[selectedRowKeys[j] - 1][currentSelected])
              listItem[selectedRowKeys[j] - 1][currentSelected] =
                parseFloat(listItem[selectedRowKeys[j] - 1][currentSelected]) +
                currentPercent
            }
          }
        }
      }
      onOkList(listItem)
    })
  }
  const handleDefault = () => {
    Modal.confirm({
      title: 'Cancel all change',
      content: 'Dismiss All Change to Previous Price',
      onOk () {
        for (let i in selectedRowKeys) {
          listItem[selectedRowKeys[i] - 1].sellPrice = listItem[selectedRowKeys[i] - 1].prevSellPrice
          listItem[selectedRowKeys[i] - 1].distPrice01 = listItem[selectedRowKeys[i] - 1].prevDistPrice01
          listItem[selectedRowKeys[i] - 1].distPrice02 = listItem[selectedRowKeys[i] - 1].prevDistPrice02
          listItem[selectedRowKeys[i] - 1].distPrice03 = listItem[selectedRowKeys[i] - 1].prevDistPrice03
          listItem[selectedRowKeys[i] - 1].distPrice04 = listItem[selectedRowKeys[i] - 1].prevDistPrice04
          listItem[selectedRowKeys[i] - 1].distPrice05 = listItem[selectedRowKeys[i] - 1].prevDistPrice05
          listItem[selectedRowKeys[i] - 1].distPrice06 = listItem[selectedRowKeys[i] - 1].prevDistPrice06
          listItem[selectedRowKeys[i] - 1].distPrice07 = listItem[selectedRowKeys[i] - 1].prevDistPrice07
          listItem[selectedRowKeys[i] - 1].distPrice08 = listItem[selectedRowKeys[i] - 1].prevDistPrice08
        }
        onOkList(listItem)
      }
    })
  }
  const handleCancel = () => {
    onCancelList()
  }
  const prefixSelector = (key) => {
    return getFieldDecorator(`prefix${key}`, {
      initialValue: 'Percent'
    })(
      <Select style={{ width: 70 }}>
        <Option value="Nominal">(N)</Option>
        <Option value="Percent">(%)</Option>
      </Select>
    )
  }
  const modalOpts = {
    ...formEditProps,
    onOk: handleOk
  }
  return (
    <Modal
      {...modalOpts}
      footer={
        [
          <Button size="large" onClick={handleDefault}>Default</Button>,
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
    >
      <Form layout="horizontal">
        <FormItem label={getDistPriceName('sellPrice')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('sellPrice', {
            initialValue: currentItemList.sellPrice,
            rules: [{
              required: false
            }]
          })(<Input type="number" addonBefore={prefixSelector('sellPrice')} autoFocus style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
      <Form layout="horizontal">
        <FormItem label={getDistPriceName('distPrice01')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice01', {
            initialValue: currentItemList.distPrice01,
            rules: [{
              required: false
            }]
          })(<Input type="number" addonBefore={prefixSelector('distPrice01')} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
      <Form layout="horizontal">
        <FormItem label={getDistPriceName('distPrice02')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice02', {
            initialValue: currentItemList.distPrice02,
            rules: [{
              required: false
            }]
          })(<Input type="number" addonBefore={prefixSelector('distPrice02')} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
    </Modal >
  )
}
ModalEdit.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalEdit)
