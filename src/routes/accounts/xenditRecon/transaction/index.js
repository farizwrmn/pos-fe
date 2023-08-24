import { Row, Table } from 'antd'

const Transaction = ({ onChangePagination, onClickTransaction, ...tableProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100
    },
    {
      title: 'Store Name (Click to see detail)',
      dataIndex: 'store',
      key: 'store',
      width: 300,
      render: value => value.storeName
    }
  ]

  const handleOnRowClick = (item) => {
    onClickTransaction(item.id)
  }

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
        onRowClick={handleOnRowClick}
      />
    </Row>
  )
}

export default Transaction
