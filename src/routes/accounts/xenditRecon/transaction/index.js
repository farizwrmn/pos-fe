import { Row, Table } from 'antd'

const Transaction = ({ onChangePagination, onClickTransaction, ...tableProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100,
      render: (value, record) => {
        return (
          <a onClick={() => onClickTransaction(record.id)}>{value}</a>
        )
      }
    },
    {
      title: 'Store Name (Click to see detail)',
      dataIndex: 'store',
      key: 'store',
      width: 300,
      render: value => value.storeName
    }
  ]

  return (
    <Row style={{ padding: '10px' }}>
      <h3 style={{ fontWeight: 'bolder' }}>
        Transaction
      </h3>
      <Table
        {...tableProps}
        columns={columns}
        bordered
        onChange={onChangePagination}
      />
    </Row>
  )
}

export default Transaction
