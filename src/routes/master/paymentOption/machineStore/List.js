import { Row, Table } from 'antd'
import { color } from 'utils/theme'

const List = ({ ...tableProps, handlePagination }) => {
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
      width: 40,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Account',
      key: 'accountCode.accountName',
      dataIndex: 'accountCode.accountName',
      width: 100
    }
  ]

  return (
    <div>
      <Row>
        <div style={{ color: color.error }}>
          * Klik data di bawah ini untuk melihat store yang terhubung dengan jenis payment
        </div>
      </Row>
      <Row>
        <Table
          {...tableProps}
          bordered
          columns={columns}
          onChange={handlePagination}
        />
      </Row>
    </div>
  )
}

export default List
