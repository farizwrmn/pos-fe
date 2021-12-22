import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'
import { numberFormat } from 'utils'
import { numberFormatter } from 'utils/string'
import PrintPDF from './PrintPDF'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, storeInfo, user, data, listDetailTrans, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const printProps = {
    itemPrint: data,
    itemHeader: data,
    storeInfo,
    user,
    printNo: 1
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 200
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 120
    },
    {
      title: 'Amount',
      dataIndex: 'depositTotal',
      key: 'depositTotal',
      width: 120,
      className: styles.alignCenter,
      render: text => numberFormatter(text || 0)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 240
    },
    {
      title: 'Print',
      dataIndex: 'print',
      key: 'print',
      width: 240,
      render: (text, record) => {
        return (
          <Link><PrintPDF listItem={listDetailTrans.filter(filtered => parseFloat(filtered.storeId) === parseFloat(record.storeId))} {...printProps} /></Link>
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        pagination={false}
        simple
        rowKey={record => record.no}
        title={() => {
          const total = tableProps.dataSource.reduce((prev, next) => prev + (next.adjInQty > 0 ? next.adjInQty * next.sellingPrice : next.adjOutQty * next.sellingPrice), 0)
          return (
            <div>
              <strong>{`Total: ${formatNumberIndonesia(total)}`}</strong>
            </div>
          )
        }}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
