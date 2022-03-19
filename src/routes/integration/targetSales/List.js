import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps,
  editItem,
  deleteItem
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.targetName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Nama Target',
      dataIndex: 'targetName',
      key: 'targetName',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <div>{record.targetName}</div>
          </div>
        )
      }
    },
    {
      title: 'Product 1',
      dataIndex: 'product1',
      key: 'product1',
      width: 150,
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
      width: 150,
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
      width: 150,
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
      width: 150,
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
      width: 150,
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
      width: 100,
      render: (text) => {
        return (
          <div>
            <div>{text ? moment(text).format('DD-MM-YYYY') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
      width: 100,
      render: (text) => {
        return (
          <div>
            <div>{text ? moment(text).format('DD-MM-YYYY') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
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
              { key: '2', name: 'Delete', disabled: false }
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
        columns={columns}
        simple
        scroll={{ x: 1300 }}
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
