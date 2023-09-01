import { Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListSummary = ({
  handlePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Jenis Pembayaran',
      dataIndex: 'paymentOptionName',
      key: 'paymentOptionName'
    },
    {
      title: 'Total Input',
      dataIndex: 'totalBalanceInput',
      key: 'totalBalanceInput',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      onChange={handlePagination}
    />
  )
}

export default ListSummary
