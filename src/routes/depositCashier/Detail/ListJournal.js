import { Col, Table } from 'antd'

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
      <h3 style={{ fontWeight: 'bold' }}>
        List Journal
      </h3>
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
