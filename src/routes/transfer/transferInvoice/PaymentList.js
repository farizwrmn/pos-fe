import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import styles from '../../../themes/index.less'

const PaymentList = ({
  onPayment,
  ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onPayment(record)
    }
  }

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        return (
          <Link to={`/inventory/transfer/invoice/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Owing',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'netto',
      key: 'netto',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
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
              { key: '1', name: 'Payment' }
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

PaymentList.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default PaymentList
