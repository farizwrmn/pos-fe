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
      title: 'Sales Name',
      dataIndex: 'salesName',
      key: 'salesName',
      render: (text, record) => {
        return (
          <div>
            <div>{record.salesName}</div>
          </div>
        )
      }
    },
    {
      title: 'customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (text, record) => {
        return (
          <div>
            <div>{record.customer}</div>
          </div>
        )
      }
    },
    {
      title: 'No Faktur',
      dataIndex: 'noFaktur',
      key: 'noFaktur',
      render: (text, record) => {
        return (
          <div>
            <div>{record.noFaktur}</div>
          </div>
        )
      }
    },
    {
      title: 'Tgl Faktur',
      dataIndex: 'tglFaktur',
      key: 'tglFaktur',
      render: (text, record) => {
        return (
          <div>
            <div>{record.tglFaktur ? moment(record.tglFaktur).format('DD-MM-YYYY HH:mm:ss') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      render: (text, record) => {
        return (
          <div>
            <div>{record.jatuhTempo ? moment(record.jatuhTempo).format('DD-MM-YYYY HH:mm:ss') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Nilai Faktur',
      dataIndex: 'nilaiFaktur',
      key: 'nilaiFaktur',
      render: (text, record) => {
        return (
          <div>
            <div>{record.nilaiFaktur}</div>
          </div>
        )
      }
    },
    {
      title: 'Hutang',
      dataIndex: 'hutang',
      key: 'hutang',
      render: (text, record) => {
        return (
          <div>
            <div>{record.hutang}</div>
          </div>
        )
      }
    },
    {
      title: 'Umur Hutang',
      dataIndex: 'umurHutang',
      key: 'umurHutang',
      render: (text, record) => {
        return (
          <div>
            <div>{record.umurHutang}</div>
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
