import { Table } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ListBalance = ({
  handleChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Open-Closed Time',
      render: (_, record) => <div>{moment(record.open).format('DD MMM YYYY, HH:mm:ss')} - {moment(record.closed).format('DD MMM YYYY, HH:mm:ss')}</div>
    },
    {
      title: 'Total Balance Payment',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Selisih',
      dataIndex: 'totalDiffBalance',
      key: 'totalDiffBalance',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Journal Invoice',
      dataIndex: 'journalInvoice',
      key: 'journalInvoice',
      render: value => <div style={{ textAlign: 'center' }}>{value || '-'}</div>
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      onChange={handleChangePagination}
    />
  )
}

export default ListBalance
