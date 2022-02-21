import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps,
  user,
  editItem,
  deleteItem
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.namaTarget} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <div>
            <div>{record.id}</div>
          </div>
        )
      }
    },
    {
      title: 'Nama Target',
      dataIndex: 'namaTarget',
      key: 'namaTarget',
      render: (text, record) => {
        return (
          <div>
            <div>{record.namaTarget}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 1',
      dataIndex: 'product1',
      key: 'product1',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product1}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 2',
      dataIndex: 'product2',
      key: 'product2',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product2}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 3',
      dataIndex: 'product3',
      key: 'product3',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product3}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 4',
      dataIndex: 'product4',
      key: 'product4',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product4}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 5',
      dataIndex: 'product5',
      key: 'product5',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product5}</div>
          </div>
        )
      }
    },

    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (text, record) => {
        return (
          <div>
            <div>{record.validFrom}</div>
          </div>
        )
      }
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
      render: (text, record) => {
        return (
          <div>
            <div>{record.validTo}</div>
          </div>
        )
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
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
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete' }
            ]}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={(user.permissions.role === 'SPR' || user.permissions.role === 'OWN')
          ? columns
          : []}
        simple
        scroll={{ x: 2000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
