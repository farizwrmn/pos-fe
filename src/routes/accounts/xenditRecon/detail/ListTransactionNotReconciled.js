import { Row, Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListTransactionNotReconciled = ({
  listTransactionNotRecon
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 50
    },
    {
      title: 'Invoice No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 50,
      render: value => <a href={`/accounts/payment/${encodeURIComponent(value)}`} target="_blank">{value}</a>
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 50,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 50,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'recon',
      key: 'recon',
      width: 100,
      render: value => <p style={{ textAlign: 'center' }}><Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Recon' : 'Not Recon'}</Tag></p>
    }
  ]

  return (
    <div>
      <Row>
        <h3 style={{ fontWeight: 'bolder' }}>Not Reconciled</h3>
      </Row>
      <Row>
        <Table
          dataSource={listTransactionNotRecon}
          columns={columns}
          bordered
          scroll={{ x: 700 }}
        />
      </Row>
    </div>
  )
}

export default ListTransactionNotReconciled
