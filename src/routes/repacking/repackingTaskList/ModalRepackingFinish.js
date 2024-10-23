import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Table, Button, Row, Col, Modal, Card, Input } from 'antd'
import ModalMemberTier from './ModalRecipe'

const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

class ModalRepackingFinish extends Component {
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
      item = {},
      onSubmit,
      onOpenModalTier,
      modalMemberTierProps,
      modalType,
      button,
      material,
      loading,
      detail,
      form: {
        getFieldDecorator,
        validateFields,
        resetFields
      },
      ...modalProps
    } = this.props

    const columnTier = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no'
      },
      {
        title: 'Product',
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => {
          if (record) {
            const materialRequest = material ? material.filter(filtered => filtered.detailRequestId === record.id) : []
            return (
              <div>
                <div><strong>{record.productName}</strong></div>
                {materialRequest && materialRequest.map(item => (
                  <div>
                    <div style={{ marginLeft: '10px' }}>{item.qty} x {item.productName}</div>
                  </div>
                ))}
              </div>
            )
          }
        }
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty'
      },
      {
        title: 'Min Qty',
        dataIndex: 'minQty',
        key: 'minQty'
      },
      {
        title: 'Max Qty',
        dataIndex: 'maxQty',
        key: 'maxQty'
      }
    ]

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const response = {
          header: {
            id: item.id,
            transNo: item.transNo
          },
          detail,
          material
        }
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(response, resetFields)
          },
          onCancel () { }
        })
      })
    }

    return (
      <Modal {...modalProps}>
        <Form layout="horizontal">
          <Card title="Header" style={{ margin: '10px 0' }}>
            <Row>
              <Col {...column}>
                <FormItem label="Trans No" hasFeedback {...formItemLayout} >
                  {getFieldDecorator('transNo', {
                    initialValue: item.transNo,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem
                  label="Store Target"
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('storeIdReceiver', {
                    initialValue: item.storeReceiverName,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem label="Description" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: item.description,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<TextArea disabled maxLength={255} autosize={{ minRows: 2, maxRows: 3 }} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            title={(
              <div>
                <span style={{ marginRight: '10px' }}>Request</span>
              </div>
            )}
            style={{ margin: '10px 0' }}
          >
            <Table
              dataSource={detail && detail.map((item, index) => ({ no: index + 1, ...item }))}
              pagination={false}
              bordered
              onRowClick={record => onOpenModalTier('edit', record)}
              columns={columnTier}
              simple
              scroll={{ x: 700 }}
            />
          </Card>
          {modalMemberTierProps.visible && <ModalMemberTier {...modalMemberTierProps} />}
          <FormItem>
            <Button type="primary" onClick={handleSubmit} loading={loading} disabled={loading}>{button}</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalRepackingFinish.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(ModalRepackingFinish)
