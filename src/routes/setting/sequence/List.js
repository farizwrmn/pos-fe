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
        title: `Are you sure delete ${record.counterName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Store Id',
      dataIndex: 'storeId',
      key: 'storeId'
    },
    {
      title: 'Code',
      dataIndex: 'seqCode',
      key: 'seqCode'
    },
    {
      title: 'Type Seq',
      dataIndex: 'typeSeq',
      key: 'typeSeq'
    },
    {
      title: 'Sequence',
      dataIndex: 'seqName',
      key: 'seqName'
    },
    {
      title: 'Value',
      dataIndex: 'seqValue',
      key: 'seqValue'
    },
    {
      title: 'Initial Char',
      dataIndex: 'initialChar',
      key: 'initialChar'
    },
    {
      title: 'Max Number',
      dataIndex: 'maxNumber',
      key: 'maxNumber'
    },
    {
      title: 'Reset Type',
      dataIndex: 'resetType',
      key: 'resetType'
    },
    {
      title: 'Reset Date',
      dataIndex: 'resetDate',
      key: 'resetDate'
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue'
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
        scroll={{ x: 1000 }}
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
