import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import InputSearch from './InputSearch'


const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem, ...inputSearchProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.policeNo} ?`,
        onOk () {
          deleteItem(record.memberCode, record.policeNo)
        },
      })
    }
  }

  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo',
    },
    {
      title: 'Merk',
      dataIndex: 'merk',
      key: 'merk',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Chassis No',
      dataIndex: 'chassisNo',
      key: 'chassisNo',
    },
    {
      title: 'Machine No',
      dataIndex: 'machineNo',
      key: 'machineNo',
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
      },
    },
  ]

  return (
    <div>
      <InputSearch {...inputSearchProps} />
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 800 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func,
}

export default List