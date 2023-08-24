import { Row, Table } from 'antd'

const Balance = ({ onChangePagination, onClickBalance, ...tableProps }) => {
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
    onClickBalance(item.id)
  }

  return (
    <Row style={{ padding: '10px' }}>
      <h3 style={{ fontWeight: 'bolder' }}>
        Balance
      </h3>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        onChange={onChangePagination}
        onRowClick={handleOnRowClick}
      />
    </Row>
  )
}

export default Balance
