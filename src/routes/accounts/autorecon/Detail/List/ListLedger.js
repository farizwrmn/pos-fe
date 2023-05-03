import { Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListLedger = ({
  dataSource,
  loading
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Code',
      dataIndex: 'accountCode.accountCode',
      key: 'accountCode.accountCode',
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'accountCode.accountName',
      key: 'accountCode.accountName',
      width: 300
    },
    {
      title: 'Trans Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 80
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 120,
      render: value => (Number(value || 0) ? currencyFormatter(Number(value)) : currencyFormatter(0))
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 120,
      render: value => (Number(value || 0) ? currencyFormatter(Number(value)) : currencyFormatter(0))
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200
    }
  ]

  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '15px 15px 5px 15px' }}>
        Account Ledger
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1100 }}
        loading={loading.effects['autorecon/resolve'] || loading.effects['autorecon/queryDetail']}
      />
    </div>
  )
}

export default ListLedger
