import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import { lstorage } from 'utils'
import moment from 'moment'

const confirm = Modal.confirm
const userRole = lstorage.getCurrentUserRole()

const List = ({
  listAllStores,
  user,
  dispatch,
  loadingModel,
  editItem,
  deleteItem,
  listCategory,
  listBrand,
  ...tableProps
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.name} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Store',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Tag color={record.name ? 'blue' : 'red'}>{record.name}</Tag>
      }
    },
    {
      title: 'viewAt',
      dataIndex: 'viewAt',
      key: 'viewAt',
      render: (text, record) => {
        return <Tag color={record.viewBy ? 'blue' : 'red'}>{record.viewAt}</Tag>
      }
    },
    {
      title: 'viewBy',
      dataIndex: 'viewBy',
      key: 'viewBy',
      render: (text, record) => {
        return <Tag color={record.viewBy ? 'blue' : 'red'}>{record.viewBy}</Tag>
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text, record) => (record.updatedAt ? moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Operation',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete', disabled: userRole !== 'OWN' }
              // { key: '3', name: 'History' }
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
        rowKey={record => record.id}
      // columns={(user.permissions.role === 'SPR'
      //   || user.permissions.role === 'OWN'
      //   || user.permissions.role === 'HPC'
      //   || user.permissions.role === 'SPC'
      //   || user.permissions.role === 'HFC'
      //   || user.permissions.role === 'SFC'
      //   || user.permissions.role === 'PCS')
      //   ? columns
      //   : (user.permissions.role === 'ADF'
      //     || user.permissions.role === 'HWR'
      //     || user.permissions.role === 'AWR' ?
      //     columns.filter(filtered => filtered.key !== 'costPrice' && filtered.key !== 'margin')
      //     : columns.filter(filtered => filtered.key !== 'costPrice' && filtered.key !== 'supplierId' && filtered.key !== 'margin'))}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  delete: PropTypes.func
}

export default List
