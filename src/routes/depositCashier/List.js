import { Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      render: (_, record) => <a href={`/setoran/cashier/${record.id}`} target="_blank">{`${record.startDate} - ${record.endDate}`}</a>
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Selisih',
      dataIndex: 'totalDiffBalance',
      key: 'totalDiffBalance',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
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
