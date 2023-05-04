import React, { Component } from 'react'
import { Modal, Form, Table, Input } from 'antd'

const FormItem = Form.Item
const { Search } = Input

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

class ModalEditSupplier extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('query')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      onChooseSupplier,
      listSupplierHistory,
      listSupplier,
      onSearch,
      loading,
      item,
      form: { getFieldDecorator, getFieldsValue, validateFields },
      ...modalProps
    } = this.props

    const columns = [
      {
        title: 'Code',
        dataIndex: 'supplierCode',
        key: 'supplierCode'
      },
      {
        title: 'Supplier Name',
        dataIndex: 'supplierName',
        key: 'supplierName'
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
        onChooseSupplier({
          ...record,
          supplierChangeMemo: data.supplierChangeMemo
        })
      })
    }

    return (
      <Modal
        okText={null}
        {...modalProps}
      >
        <FormItem label="Why Changing Supplier ?" hasFeedback {...formItemLayout}>
          {getFieldDecorator('supplierChangeMemo', {
            initialValue: item.supplierChangeMemo,
            rules: [
              {
                required: true,
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

        <h1>Purchase History</h1>
        <Table
          pagination={false}
          bordered
          columns={columns}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listSupplierHistory}
          onRowClick={record => onSubmit(record)}
        />
        <br />
        <h1>Supplier List</h1>
        <Search
          id="query"
          placeholder="Search supplier here"
          style={{ width: 200 }}
          onSearch={value => onSearch(value)}
        />
        <br />
        <Table
          style={{ marginTop: '10px' }}
          pagination={false}
          bordered
          columns={columns}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listSupplier}
          onRowClick={record => onSubmit(record)}
        />
      </Modal>
    )
  }
}

export default Form.create()(ModalEditSupplier)
