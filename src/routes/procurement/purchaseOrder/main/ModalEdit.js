import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Row, Col, Modal, Button } from 'antd'
import LatestPrice from './LatestPrice'

const FormItem = Form.Item

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
      item,
      onCancel,
      onOk,
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
          onOk(data)
        } else {
          Modal.warning({
            title: 'Message Error',
            content: 'Qty must greater than zero!'
          })
        }
      })
    }
    const handleCancel = () => {
      onCancel()
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

    const latestPriceProps = {
      dataSource: listPurchaseLatestDetail,
      loading: loadingPurchaseLatest
    }

    return (
      <Modal
        width="700px"
        onCancel={onCancel}
        title={`${currentItemList.productCode} - ${currentItemList.productName}`}
        {...modalOpts}
        footer={[
          <Button size="large" key="delete" type="danger" onClick={handleDelete} disabled={item && item.requisitionId}>Delete</Button>,
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Row>
          <Col md={24} lg={12}>
            <LatestPrice {...latestPriceProps} />
          </Col>
          <Col md={24} lg={12}>
            <Form layout="horizontal">
              <FormItem label="No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('no', {
                  initialValue: currentItemList.no,
                  rules: [{
                    required: true
                  }]
                })(<Input disabled maxLength={10} />)}
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
                {getFieldDecorator('purchasePrice', {
                  initialValue: currentItemList.purchasePrice,
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
              <FormItem label="Disc (%)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPercent', {
                  initialValue: currentItemList.discPercent || 0,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <InputNumber
                    min={0}
                    max={100}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleOk()
                      }
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="Disc (N)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discNominal', {
                  initialValue: currentItemList.discNominal || 0,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <InputNumber
                    min={0}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleOk()
                      }
                    }}
                  />
                )}
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
