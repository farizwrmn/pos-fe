import React, { Component } from 'react'
import { Modal, Form, Table, Input } from 'antd'

const { Search } = Input

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
    return (
      <Modal
        okText={null}
        {...modalProps}
      >
        <h1>Purchase History</h1>
        <Table
          pagination={false}
          bordered
          columns={columns}
          simple
          loading={loading}
          rowKey={record => record.id}
          dataSource={listSupplierHistory}
          onRowClick={record => onChooseSupplier(record)}
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
          onRowClick={record => onChooseSupplier(record)}
        />
      </Modal>
    )
  }
}

export default Form.create()(ModalEditSupplier)
