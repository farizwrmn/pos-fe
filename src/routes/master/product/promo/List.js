import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
// import { Table, Modal} from 'antd'
import { DropOption } from 'components'
import moment from 'moment'


// const confirm = Modal.confirm

const List = ({ ...tableProps,
  user
  // editItem,
  // deleteItem,
}) => {
  const handleMenuClick = (record, e) => {
    // if (e.key === '1') {
    //   editItem(record)
    // } else if (e.key === '2') {
    //   confirm({
    //     title: `Are you sure delete ${record.productName} ?`,
    //     onOk () {
    //       deleteItem(record.productCode)
    //     }
    //   })
    // }
  }

  const columns = [
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
          : columns.filter(filtered => filtered.key !== 'costPrice' && filtered.key !== 'supplierId' && filtered.key !== 'margin')}
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
