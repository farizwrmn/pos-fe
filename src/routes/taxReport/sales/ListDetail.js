import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropOption } from 'components'
import { Table } from 'antd'

class List extends Component {
  state = {
    pagination: {
      page: 1,
      pageSize: 10
    }
  }

  render () {
    const { onShowModalEdit, selectedRowKeys, list, updateSelectedKey, ...tableProps } = this.props

    const { pagination } = this.state

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        onShowModalEdit(record)
      }
    }

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
      },
      {
        title: 'Operation',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: 'Edit' }
              ]}
            />
          )
        }
      }
    ]

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: false,
      onChange: (selectedRowKeys) => {
        updateSelectedKey(selectedRowKeys)
      },
      onSelectAll: (checked, tableData) => {
        const { filters } = this.state
        let listTable = list
        if (filters && filters.brandName && filters.brandName.length > 0) {
          listTable = listTable.filter((filtered) => {
            return filters.brandName.includes(filtered.brandName)
          })
        }
        if (filters && filters.categoryName && filters.categoryName.length > 0) {
          listTable = listTable.filter((filtered) => {
            return filters.categoryName.includes(filtered.categoryName)
          })
        }
        if (tableData.length === selectedRowKeys.length) {
          updateSelectedKey([])
        } else {
          updateSelectedKey(listTable.map(item => item.id))
        }
      }
    }

    return (
      <div>
        <Table {...tableProps}
          rowSelection={rowSelection}
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
              '1000'
            ]
          }}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1000 }}
          rowKey={record => record.id}
          footer={() => (
            <div>
              <div>QTY : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.qty || 0), 0).toLocaleString()}</div>
              <div>DPP : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.DPP || 0), 0).toLocaleString()}</div>
              <div>PPN : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.PPN || 0), 0).toLocaleString()}</div>
              <div>COST : {this.props.dataSource.reduce((cnt, o) => cnt + parseFloat(o.cogsTotal || 0), 0).toLocaleString()}</div>
              <div>TOTAL : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0).toLocaleString()}</div>
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
