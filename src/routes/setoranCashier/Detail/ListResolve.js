import { Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListResolve = ({
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
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      width: 100,
      render: value => <div style={{ textAlign: 'end', color: value > 0 ? '#008000' : value < 0 ? '#FF0000' : '#000000' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Resolve Status',
      dataIndex: 'statusResolved',
      key: 'statusResolved',
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
    />
  )
}

export default ListResolve
