import React from 'react'
import moment from 'moment'
import { DropOption } from 'components'
import { Table, Icon } from 'antd'
import { routerRedux } from 'dva/router'
import styles from '../../../themes/index.less'

const List = ({ ...tableProps, dispatch, printInvoice }) => {
  const printPurchaseHistory = (record) => {
    printInvoice(record.transNo)
  }

  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      printPurchaseHistory(record)
    }
    if (e.key === '2') {
      dispatch(routerRedux.push(`/accounts/payable/${encodeURIComponent(record.transNo)}`))
    }
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      sorter: () => { },
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'No',
      dataIndex: 'transNo',
      sorter: () => { },
      key: 'transNo'
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      sorter: () => { },
      key: 'storeName'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: 'Disc(%)',
      dataIndex: 'discInvoicePercent',
      key: 'discInvoicePercent',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Disc(N)',
      dataIndex: 'discInvoiceNominal',
      key: 'discInvoiceNominal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Term',
      dataIndex: 'tempo',
      key: 'tempo',
      render: text => `${text} day(s)`
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: <Icon type="setting" />,
      key: 'operation',
      fixed: 'right',
      width: 75,
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          type="primary"
          menuOptions={[
            { key: '1', name: 'Print', icon: 'printer' },
            { key: '2', name: 'Payment', icon: 'pay-circle-o' }
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

export default List
