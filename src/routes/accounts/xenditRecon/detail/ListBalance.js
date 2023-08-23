import { Row, Table } from 'antd'

const ListBalance = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Invoice'
    },
    {
      title: 'Invoice Date'
    },
    {
      title: 'Reference'
    },
    {
      title: 'Payment Date'
    },
    {
      title: 'Status'
    }
  ]

  return (
    <Row>
      <Table
        {...tableProps}
        bordered
        columns={columns}
      />
    </Row>
  )
}

export default ListBalance
