import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import DropOption from 'components/DropOption'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
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
      dataIndex: 'id',
      key: 'id'
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
      dataIndex: 'address1',
      key: 'address1'
    },
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: 'Post Code',
      dataIndex: 'postCode',
      key: 'postCode'
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone'
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
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} items`
        }}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
