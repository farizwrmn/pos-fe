import React, { Component } from 'react'
import { Modal, message, Input, Form, Button, Table, InputNumber } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 }
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 16 }
  }
}

class ModalEditQty extends Component {
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
      listStock,
      listPurchaseOrder,
      loading,
      item,
      form: { getFieldsValue, getFieldValue, validateFields, getFieldDecorator },
      onChangeQty,
      onCancel,
      ...modalProps
    } = this.props

    const columns = [
      {
        title: 'Store',
        dataIndex: 'storeName',
        key: 'storeName',
        render: (text, record) => {
          return <div style={{ color: record.qty <= 0 ? 'red' : 'initial' }}>{text}</div>
        }
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        render: (text) => {
          return <div style={{ color: text <= 0 ? 'red' : 'initial' }}>{text}</div>
        }
      }
    ]
    const columnsPurchaseOrder = [
      {
        title: 'No',
        dataIndex: 'transNo',
        key: 'transNo'
      },
      {
        title: 'Date',
        dataIndex: 'transDate',
        key: 'transDate'
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Price',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Disc (%)',
        dataIndex: 'discPercent',
        key: 'discPercent',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Disc (N)',
        dataIndex: 'discNominal',
        key: 'discNominal',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Inv.Disc (%)',
        dataIndex: 'discInvoicePercent',
        key: 'discInvoicePercent',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Inv.Disc (N)',
        dataIndex: 'discInvoiceNominal',
        key: 'discInvoiceNominal',
        render: text => (text || 0).toLocaleString()
      },
      {
        title: 'Delivery Fee',
        dataIndex: 'deliveryFee',
        key: 'deliveryFee',
        render: (text, record) => ((text || 0) / (record.portion || 0)).toLocaleString()
      }
    ]

    const onSubmit = (record) => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        if (record) {
          data.qty = record.qty
        }
        if (data.qty < item.recommendToBuy
          && (!data.notFulfilledQtyMemo
            || (data.notFulfilledQtyMemo
              && data.notFulfilledQtyMemo.length < 10))) {
          message.error('Why buying less than recommended is required')
          return
        }
        onChangeQty({
          qty: data.qty,
          notFulfilledQtyMemo: data.notFulfilledQtyMemo
        })
      })
    }

    return (
      <Modal
        width={800}
        onCancel={onCancel}
        footer={[
          (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading}>Cancel</Button>),
          (<Button id="buttonSubmit" type="primary" onClick={() => onSubmit()} disabled={loading}>Ok</Button>)
        ]}
        {...modalProps}
      >

        <FormItem label="Qty" hasFeedback {...formItemLayout}>
          {getFieldDecorator('qty', {
            initialValue: item.qty,
            rules: [
              {
                required: true
              }
            ]
          })(
            <InputNumber
              min={0}
              defaultValue={item.qty}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  onSubmit()
                }
              }}
            />
          )}
        </FormItem>
        <FormItem label="Why buying less than recommended ?" hasFeedback {...formItemLayout}>
          {getFieldDecorator('notFulfilledQtyMemo', {
            initialValue: item.notFulfilledQtyMemo,
            rules: [
              {
                required: getFieldValue('qty') < item.recommendToBuy,
                pattern: /^[a-z0-9/\n _-]{10,100}$/i,
                message: 'At least 10 character'
              }
            ]
          })(
            <Input
              maxLength={255}
            />
          )}
        </FormItem>
        <br />
        <Table
          pagination={false}
          bordered
          columns={columnsPurchaseOrder}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listPurchaseOrder}
          onRowClick={record => onSubmit({
            qty: record.qty,
            notFulfilledQtyMemo: record.notFulfilledQtyMemo
          })}
        />
        <br />
        <Table
          pagination={false}
          bordered
          columns={columns}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listStock}
          onRowClick={record => onSubmit({
            qty: record.qty,
            notFulfilledQtyMemo: record.notFulfilledQtyMemo
          })}
        />
      </Modal>
    )
  }
}

export default Form.create()(ModalEditQty)
