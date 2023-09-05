import { Button, Col, Row, Table } from 'antd'

const ListJournal = ({
  handleChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Account',
      render: (_, record) => <div>{record.accountCode} - {record.accountName}</div>
    },
    {
      title: 'Amount IN',
      dataIndex: 'amountIn',
      key: 'amountIn'
    },
    {
      title: 'Amount OUT',
      dataIndex: 'amountOut',
      key: 'amountOut'
    },
    {
      title: 'Status',
      dataIndex: 'recon',
      key: 'recon'
    }
  ]

  return (
    <Col span={24}>
      <Row type="flex" align="bottom" style={{ marginBottom: '10px' }}>
        <h3 style={{ fontWeight: 'bold', flex: 1 }}>
          List Journal
        </h3>
        <Button type="primary" icon="plus">
          Create Journal
        </Button>
      </Row>
      <Table
        {...tableProps}
        columns={columns}
        bordered
        onChange={handleChangePagination}
      />
    </Col>
  )
}

export default ListJournal
