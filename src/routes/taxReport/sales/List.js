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
        <Table {...this.props}
          onChange={(pagination) => {
            this.setState({
              pagination
            })
          }}
          pagination={{
            total: this.props.dataSource.length,
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `Total ${total} Records`,
            pageSizeOptions: [
              '10',
              '20',
              '30',
              '40',
              `${this.props.dataSource.length}`
            ]
          }}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1000 }}
          rowKey={record => record.id}
          footer={() => (
            <div>
              <div>DPP : {this.props.dataSource.reduce((cnt, o) => cnt + parseFloat(o.DPP || 0), 0).toLocaleString()}</div>
              <div>PPN : {this.props.dataSource.reduce((cnt, o) => cnt + parseFloat(o.PPN || 0), 0).toLocaleString()}</div>
              <div>TOTAL : {this.props.dataSource.reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0).toLocaleString()}</div>
            </div>)
          }
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
