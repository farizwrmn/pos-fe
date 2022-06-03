import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.accountName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
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
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        pagination={{
          total: tableProps.dataSource.length,
          showSizeChanger: true,
          showQuickJumper: true,
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
        footer={() => (
          <div>
            <div>DPP : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.DPP || 0), 0).toLocaleString()}</div>
            <div>PPN : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.PPN || 0), 0).toLocaleString()}</div>
            <div>TOTAL : {tableProps.dataSource.reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0).toLocaleString()}</div>
          </div>)
        }
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
