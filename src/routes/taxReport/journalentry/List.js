import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import styles from '../../../themes/index.less'

const confirm = Modal.confirm

const List = ({
  user,
  editItem,
  deleteItem,
  ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.transNo} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        return (
          <Link to={`/tools/transaction/journal-entry/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Total',
      dataIndex: 'amountOut',
      key: 'amountOut',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Desc',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY/MM/DD') - moment.utc(b.transDate, 'YYYY/MM/DD'),
      render: _text => `${_text ? moment(_text).format('DD-MMM-YYYY') : '-'}`
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
              {
                key: '2',
                name: 'Delete',
                disabled: !(user.permissions.role === 'SPR'
                  || user.permissions.role === 'OWN'
                  || user.permissions.role === 'ITS'
                  || user.permissions.role === 'HFC'
                  || user.permissions.role === 'SFC'
                )
              }
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
