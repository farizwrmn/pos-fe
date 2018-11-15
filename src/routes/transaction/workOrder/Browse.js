import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, message } from 'antd'
import { DropOption } from 'components'
import { formatDate } from 'utils'
import styles from '../../../themes/index.less'

const confirm = Modal.confirm

const List = ({ ...tableProps, viewHeader, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      viewHeader(record)
    } else if (e.key === '2') {
      if (record.status !== 0) {
        message.error('Cannot delete this work order, status is used')
        return
      }

      confirm({
        title: `Are you sure delete ${record.woNo} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Wo No',
      dataIndex: 'woNo',
      key: 'woNo'
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'Wo Date',
      dataIndex: 'woDate',
      key: 'woDate',
      render: text => formatDate(text)
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => formatDate(text)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (Number(text)) {
          case 0:
            return 'In Progress'
          case 1:
            return 'Done'
          default:
            break
        }
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      className: styles.alignCenter,
      render: (text, record) => {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: 'View', icon: 'eye-o' },
            { key: '2', name: 'Delete', disabled: true }
          ]}
        />)
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
      />
    </div>
  )
}

List.propTypes = {
  view: PropTypes.func
}

export default List
