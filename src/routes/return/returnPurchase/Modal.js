import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Row, Col, Modal, Button, Select } from 'antd'
import LatestPrice from './LatestPrice'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class TransferModal extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('qty')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      currentItemList,
      onOkList,
      onCancelList,
      listStore,
      onDeleteItem,
      listPurchaseLatestDetail,
      loadingPurchaseLatest,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...formEditProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...currentItemList,
          ...getFieldsValue()
        }
        if (Number(data.qty) > 0) {
          data.transType = currentItemList.transType
          data.description = (data.description === '' || data.description === null ? null : data.description)
          data.productId = currentItemList.productId
          data.initialQty = currentItemList.initialQty
          data.productCode = currentItemList.productCode
          data.productName = currentItemList.productName
          onOkList(data)
        } else {
          Modal.warning({
            title: 'Message Error',
            content: 'Price must greater than zero!'
          })
        }
      })
    }
    const handleCancel = () => {
      onCancelList()
    }
    const handleDelete = () => {
      Modal.confirm({
        title: `Delete ${currentItemList.productName}`,
        content: 'Are you sure ?',
        onOk () {
          onDeleteItem(currentItemList)
          resetFields()
        }
      })
    }
    const modalOpts = {
      ...formEditProps,
      onOk: handleOk
    }

    let childrenStoreReceived = []
    if (listStore.length > 0) {
      let groupStore = []
      for (let id = 0; id < listStore.length; id += 1) {
        groupStore.push(
          <Option value={listStore[id].value}>
            {listStore[id].label}
          </Option>
        )
      }
      childrenStoreReceived.push(groupStore)
    }

    const latestPriceProps = {
      dataSource: listPurchaseLatestDetail,
      loading: loadingPurchaseLatest
    }

    return (
      <Modal
        width="80%"
        title={`${currentItemList.productCode} - ${currentItemList.productName}`}
        {...modalOpts}
        footer={[
          <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Row>
          <Col md={24} lg={16}>
            <LatestPrice {...latestPriceProps} />
          </Col>
          <Col md={24} lg={8}>
            <Form layout="horizontal">
              <FormItem label="No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('no', {
                  initialValue: currentItemList.no,
                  rules: [{
                    required: true
                  }]
                })(<Input disabled maxLength={10} />)}
              </FormItem>
              <FormItem label="Store ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transferStoreId', {
                  initialValue: currentItemList.transferStoreId,
                  rules: [{
                    required: true
                  }]
                })(
                  <Select>
                    {childrenStoreReceived}
                  </Select>
                )}
              </FormItem>
              <FormItem label="Qty" hasFeedback {...formItemLayout}>
                {getFieldDecorator('qty', {
                  initialValue: currentItemList.qty,
                  rules: [{
                    required: true
                  }]
                })(
                  <InputNumber
                    value={0}
                    min={0}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleOk()
                      }
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('DPP', {
                  initialValue: currentItemList.DPP,
                  rules: [{
                    required: true
                  }]
                })(
                  <InputNumber
                    value={0}
                    min={0}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleOk()
                      }
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="Description" hasFeedback {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: currentItemList.description,
                  rules: [{
                    required: true
                  }]
                })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 6 }} />)}
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Modal>
    )
  }
}

TransferModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(TransferModal)
