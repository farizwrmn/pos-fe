import { Table } from 'antd'
import { numberFormat } from 'utils'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Nama Produk',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (value, record) => {
        return (
          <div>
            <div>
              <strong>Harga Normal:</strong>
            </div>
            <div>
              Rp {numberFormatter(value)}
            </div>
            <div>
              <strong>Harga GrabFood GoFood:</strong>
            </div>
            <div>
              Rp {numberFormatter(record.price_grabfood_gofood)}
            </div>
            <div>
              <strong>Harga Grabmart:</strong>
            </div>
            <div>
              Rp {numberFormatter(record.price_grabmart)}
            </div>
            <div>
              <strong>Harga Commerce:</strong>
            </div>
            <div>
              Rp {numberFormatter(record.price_shopee)}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record) => {
        return (
          <div>
            <div>
              {value}
            </div>
            <div>
              <strong>Qty Sebelumnya:</strong>
              {record.lastStock}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
    />
  )
}

export default List
