import React, { Component } from 'react'
import { Modal, message, Form, Button, Table, InputNumber, Input } from 'antd'

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

class ModalEditCost extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('purchasePrice')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      listPurchaseHistory,
      loading,
      form: { getFieldsValue, getFieldValue, validateFields, getFieldDecorator },
      onCancel,
      onChangeCost,
      item,
      ...modalProps
    } = this.props
    const columns = [
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
        render: (text, record) => (((text || 0) * (record.portion || 0)) / (record.qty || 1)).toLocaleString()
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
          data.purchasePrice = record.purchasePrice
        }
        if (data.purchasePrice > item.oldPurchasePrice
          && (!data.changingCostMemo
            || (data.changingCostMemo
              && data.changingCostMemo.length < 10))) {
          message.error('Why cost changed is required')
          return
        }
        onChangeCost({
          purchasePrice: data.purchasePrice,
          changingCostMemo: data.changingCostMemo
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
        <FormItem label="Purchase Price" hasFeedback {...formItemLayout}>
          {getFieldDecorator('purchasePrice', {
            initialValue: item.purchasePrice,
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
        <FormItem label="Why cost changed ?" hasFeedback {...formItemLayout}>
          {getFieldDecorator('changingCostMemo', {
            initialValue: item.changingCostMemo || item.changingCostMemoOther,
            rules: [
              {
                required: getFieldValue('purchasePrice') > item.oldPurchasePrice,
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
          columns={columns}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listPurchaseHistory}
          onRowClick={record => onSubmit(record)}
        />
      </Modal>
    )
  }
}

export default Form.create()(ModalEditCost)
