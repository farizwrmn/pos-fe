import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'
import { Link } from 'dva/router'
// import { numberFormatter } from 'utils/string'

const List = ({ ...tableProps, approval, listAccountCode, onEditItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }

  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '120px',
      render: (text, record) => {
        return (
          <Link to={`/transaction/product-waste/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '70px'
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
      width: '100px',
      render: (text, record) => {
        const filteredAccount = listAccountCode.filter(filtered => filtered.id === record.accountId)
        if (filteredAccount && filteredAccount[0]) {
          return filteredAccount[0].accountName
        }
      }
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100px',
      render: text => moment(text).format('YYYY-MM-DD')
    },
    // {
    //   title: 'Total',
    //   dataIndex: 'total',
    //   key: 'total',
    //   width: '100px',
    //   render: (text) => {
    //     if (text) {
    //       return numberFormatter(text)
    //     }
    //     return text
    //   }
    // },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
      width: '300px'
    },
    {
      title: 'Approve',
      dataIndex: 'posting',
      key: 'posting',
      width: '50px',
      render: (text) => {
        if (text) {
          return (<Tag color="green">Approved</Tag>)
        }
        return (<Tag color="yellow">Waiting</Tag>)
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: '100px',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)}
          type="primary"
          menuOptions={[
            { key: '1', name: 'Approve', icon: 'edit', disabled: approval }
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
