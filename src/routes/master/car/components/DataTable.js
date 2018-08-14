import React from 'react'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import styles from '../../../../themes/index.less'

const confirm = Modal.confirm

const DataTable = ({ ...tableProps, headers, editItem, deleteItem, module }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record[`${module}Name`]}?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  let operation = {
    title: 'Operation',
    key: 'operation',
    width: 100,
    fixed: 'right',
    className: styles.alignCenter,
    render: (text, record) => {
      return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
    }
  }

  let columns = headers.map((x) => {
    return {
      title: x.title,
      dataIndex: x.key,
      key: x.key
    }
  })

  if (columns && columns.length) {
    columns.push(operation)
  }

  return (
    <Table {...tableProps}
      columns={columns}
      bordered
      rowKey={record => record.id}
    />
  )
}

export default DataTable
