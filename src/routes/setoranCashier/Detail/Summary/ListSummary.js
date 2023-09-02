import { Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListSummary = ({
  listSummaryTotal,
  onChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tipe Pembayaran',
      dataIndex: 'paymentOptionName',
      key: 'paymentOptionName',
      width: 100
    },
    {
      title: 'Input Cashier',
      dataIndex: 'totalBalanceInput',
      key: 'totalBalanceInput',
      width: 100,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      width: 100,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      width: 100,
      render: value => <div style={{ textAlign: 'end', color: value > 0 ? '#008000' : value < 0 ? '#FF0000' : '#000000' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Resolve Status',
      dataIndex: 'statusResolve',
      key: 'statusResolve',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}>{value || '-'}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 'completed' ? 'green' : 'red'}>{value === 'completed' ? 'Completed' : 'Pending'}</Tag></div>
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      onChange={onChangePagination}
      footer={() => {
        return (
          <div>
            <strong>Total Penjualan: </strong>{currencyFormatter(listSummaryTotal.totalBalancePayment)}<br />
            <strong>Total Selisih: </strong>{currencyFormatter(listSummaryTotal.totalDiffBalance)}
          </div>
        )
      }}
    />
  )
}

export default ListSummary
