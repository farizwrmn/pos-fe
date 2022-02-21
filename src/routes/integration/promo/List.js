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
        title: `Are you sure delete ${record.program} ?`,
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
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        return (
          <div>
            <div>{record.level}</div>
          </div>
        )
      }
    },
    {
      title: 'Program',
      dataIndex: 'program',
      key: 'program',
      render: (text, record) => {
        return (
          <div>
            <div>{record.program}</div>
          </div>
        )
      }
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.productCode}</div>
          </div>
        )
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Product Id',
      dataIndex: 'productId',
      key: 'productId',
      render: (text, record) => {
        return (
          <div>
            <div>{record.productId || record.product.id}</div>
          </div>
        )
      }
    },
    {
      title: 'Product Dimension',
      dataIndex: 'dimension',
      key: 'dimension',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.dimension}</div>
          </div>
        )
      }
    },
    {
      title: 'Product per Box',
      dataIndex: 'dimensionBox',
      key: 'dimensionBox',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Product per Pack',
      dataIndex: 'dimensionPack',
      key: 'dimensionPack',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.dimensionPack}</div>
          </div>
        )
      }
    },
    {
      title: 'Product weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.weight}</div>
          </div>
        )
      }
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.sellPrice}</div>
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
