import React from 'react'
import { Col, Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'


const numberFormatter = numberFormat.numberFormatter

const List = ({
  ...tableProps,
  onFilterChange
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 90,
      render: value => moment(value).format('DD MMM YYYY')
    },
    {
      title: 'ID Permintaan Sewa',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      render: (value, record) => {
        let time = moment(record.createdAt).format('YYMM')

        return `BR-${time}${String(value).padStart(8, '0')}`
      }
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 120
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value || 0)}`}</div>
    },
    {
      title: 'Diskon',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value || 0)}`}</div>
    },
    {
      title: 'Harga Final',
      dataIndex: 'final_price',
      key: 'final_price',
      width: 120,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value || 0)}`}</div>
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <Col span={24}>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 600 }}
        rowKey={record => record.id}
        onChange={onChange}
      />
    </Col>
  )
}

export default List
