import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalRounding = ({
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
            const currentItem = data[currentSelected]
            const currentPercent = (parseFloat(currentItem || 0) / 100) * parseFloat(listItem[selectedRowKeys[j] - 1][currentSelected])
            listItem[selectedRowKeys[j] - 1][currentSelected] =
              parseFloat(listItem[selectedRowKeys[j] - 1][currentSelected]) +
              currentPercent
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
          listItem[selectedRowKeys[i] - 1].distPrice09 = listItem[selectedRowKeys[i] - 1].prevDistPrice09
        }
        onOkList(listItem)
      }
    })
  }
  const handleCancel = () => {
    onCancelList()
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
        <FormItem label="Rounding" hasFeedback {...formItemLayout}>
          {getFieldDecorator('rounding', {
            initialValue: currentItemList.sellPrice,
            rules: [{
              required: false
            }]
          })(<Input type="number" autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
    </Modal >
  )
}

ModalRounding.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalRounding)
