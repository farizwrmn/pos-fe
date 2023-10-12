import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const Browse = ({
  handleModalShowList, listAccountCode, listItem, ...purchaseProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Type',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (text) => {
        if (text) {
          const filteredOption = listAccountCode.filter(filtered => filtered.id === text)
          if (filteredOption && filteredOption[0]) {
            return `${filteredOption[0].accountName} (${filteredOption[0].accountCode})`
          }
        }
        return null
      }
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  const hdlModalShow = (record) => {
    handleModalShowList(record)
  }

  return (
    <Table
      {...purchaseProps}
      bordered={false}
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      size="small"
      pagination={false}
      onRowClick={_record => hdlModalShow(_record)}
      footer={() => (
        <div>
          <div>Debit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountIn || 0), 0).toLocaleString()}</div>
          <div>Credit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0).toLocaleString()}</div>
        </div>)
      }
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
