import { Button, Col, Row, Table } from 'antd'

const List = ({ ...tableProps, handlePagination, handleDelete, loading }) => {
  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      width: 100
    },
    {
      title: 'Payment Option',
      key: 'paymentOption',
      dataIndex: 'paymentOption',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Account',
      key: 'accountName',
      dataIndex: 'accountName',
      width: 100,
      render: (value, record) => `${record.accountCode} - ${value}`
    },
    {
      title: 'Action',
      width: 30,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Button type="danger" size="small" icon="minus" onClick={() => handleDelete(record)} loading={loading.effects['paymentMachineStore/queryDelete']}>Remove</Button>
        </div>
      )
    }
  ]

  return (
    <div>
      <Row>
        <Col>
          <Table
            {...tableProps}
            bordered
            columns={columns}
            onChange={handlePagination}
            loading={loading.effects['paymentMachineStore/query']}
          />
        </Col>
      </Row>
    </div>
  )
}

export default List
