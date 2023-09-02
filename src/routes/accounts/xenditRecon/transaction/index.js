import { Link } from 'dva/router'
import { Row, Table } from 'antd'
import moment from 'moment'

const Transaction = ({
  location,
  onChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100,
      render: (value, record) => {
        const { query } = location
        return (
          <Link to={`/accounting/xendit-recon/detail/${record.id}`} query={{ ...query, type: 'transaction' }}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</Link>
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
