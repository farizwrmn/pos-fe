import { Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListDetail = ({
  dataSource
}) => {
  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      width: '10%',
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '10%',
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '50%'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '10%',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered
      scroll={{ x: 700 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true
      }}
      footer={() => {
        const total = dataSource.reduce((prev, curr) => { return prev + curr.total }, 0)
        return (
          <Row type="flex" align="end">
            <div style={{ flex: 1 }}>
              Total
            </div>
            <div>
              {currencyFormatter(total)}
            </div>
          </Row>
        )
      }}
    />
  )
}

export default ListDetail
