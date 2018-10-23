import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'posDate',
      key: 'posDate',
      render: text => <p style={{ textAlign: 'left' }}>{text ? moment(text).format('DD-MMM-YYYY') : null}</p>
    },
    {
      title: 'Expired Date',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: text => <p style={{ textAlign: 'left' }}>{text ? moment(text).format('DD-MMM-YYYY') : null}</p>
    },
    {
      title: 'Point IN',
      dataIndex: 'pointIn',
      key: 'pointIn',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Point OUT',
      dataIndex: 'pointOut',
      key: 'pointOut',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    }
  ]

  const totalPrice = dataSource.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        footer={() => `Total: ${formatNumberIndonesia(totalPrice)}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

