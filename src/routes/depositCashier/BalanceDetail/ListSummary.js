import { Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListSummary = ({
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tipe Pembayaran',
      dataIndex: 'paymentOptionName',
      key: 'paymentOptionName'
    },
    {
      title: 'Input',
      dataIndex: 'totalBalanceInput',
      key: 'totalBalanceInput',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Penjualan',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      render: value => <div style={{ textAlign: 'end', color: value > 0 ? '#008000' : value < 0 ? '#FF0000' : '#000' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Status Resolve',
      dataIndex: 'statusResolve',
      key: 'statusResolve',
      render: value => <div style={{ textAlign: 'center' }}>{value || '-'}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 'completed' ? 'green' : 'red'}>{value === 'completed' ? 'Completed' : 'Pending'}</Tag></div>
    }
  ]

  return (
    <div>
      <h3 style={{ fontWeight: 'bold' }}>List Summary</h3>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ListSummary
