import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.supplierName} ?`,
        onOk () {
          deleteItem(record.supplierCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'supplierCode',
      key: 'supplierCode'
    },
    {
      title: 'Name',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: 'Payment Tempo',
      dataIndex: 'paymentTempo',
      key: 'paymentTempo',
      render: text => (text ? `${text} ${parseFloat(text) > 1 ? 'days' : 'day'}` : '')
    },
    {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    },
    {
      title: 'Province',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: 'Post Code',
      dataIndex: 'zipCode',
      key: 'zipCode'
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Tax ID',
      dataIndex: 'taxId',
      key: 'taxId'
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy'
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy'
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
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
        bordered
        columns={columns}
        simple
        scroll={{ x: 1700 }}
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
