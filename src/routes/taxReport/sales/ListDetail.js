import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

class List extends Component {
  state = {
    pagination: {
      page: 1,
      pageSize: 10
    }
  }

  render () {
    const { editItem, deleteItem, ...tableProps } = this.props

    const { pagination } = this.state

    const columns = [
      {
        title: 'Trans No',
        dataIndex: 'transNo',
        key: 'transNo'
      },
      {
        title: 'Trans Date',
        dataIndex: 'transDate',
        key: 'transDate'
      },
      {
        title: 'Product',
        dataIndex: 'product.productName',
        key: 'product.productName',
        render: (text, record) => {
          return (
            <div>
              <div><strong>{record.product.productCode}</strong></div>
              <div>{record.product.productName}</div>
            </div>
          )
        }
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        render: (text) => {
          return text.toLocaleString()
        }
      },
      {
        title: 'DPP',
        dataIndex: 'DPP',
        key: 'DPP',
        render: (text) => {
          return text.toLocaleString()
        }
      },
      {
        title: 'PPN',
        dataIndex: 'PPN',
        key: 'PPN',
        render: (text) => {
          return text.toLocaleString()
        }
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (text) => {
          return text.toLocaleString()
        }
      }
    ]

    return (
      <div>
        <Table {...tableProps}
          onChange={(pagination) => {
            this.setState({
              pagination
            })
          }}
          pagination={{
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: tableProps.dataSource.length,
            showSizeChanger: true,
            showTotal: total => `Total ${total} Records`,
            pageSizeOptions: [
              '10',
              '20',
              '30',
              '40',
              `${tableProps.dataSource.length}`
            ]
          }}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1000 }}
          rowKey={record => record.id}
        />
      </div>
    )
  }
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
