import React from 'react'
import PropTypes from 'prop-types'
import { numberFormat } from 'utils'
import { Table } from 'antd'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Netto Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    }
  ]

  const totalPrice = dataSource.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 1300 }}
        columns={columns}
        simple
        footer={() => `Total Asset: ${formatNumberIndonesia(totalPrice)}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

