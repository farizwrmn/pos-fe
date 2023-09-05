import { Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListResolve = ({
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tipe Pembayaran',
      dataIndex: 'paymentOptionName',
      key: 'paymentOptionName'
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Status Resolve',
      dataIndex: 'statusResolved',
      key: 'statusResolved',
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={value === 'completed' ? 'green' : 'red'}>
              {value === 'completed' ? 'Completed' : 'Pending'}
            </Tag>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <h3 style={{ fontWeight: 'bold' }}>List Resolve</h3>
      <Table
        {...tableProps}
        bordered
        columns={columns}
      />
    </div>
  )
}

export default ListResolve
