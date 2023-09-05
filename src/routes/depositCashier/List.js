import { Table } from 'antd'
import { Link } from 'dva/router'
import { currencyFormatter } from 'utils/string'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      render: (_, record) => <Link to={`/setoran/cashier/${record.id}`}>{`${record.startDate} - ${record.endDate}`}</Link>
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
