import { Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListJournal = ({
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
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

export default ListJournal
