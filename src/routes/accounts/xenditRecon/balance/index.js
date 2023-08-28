import { Row, Table } from 'antd'
import moment from 'moment'

const Balance = ({
  onChangePagination,
  onClickBalance,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100,
      render: (value, record) => {
        return (
          <a onClick={() => onClickBalance(record.id)}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</a>
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
        Balance
      </h3>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        onChange={onChangePagination}
      />
    </Row>
  )
}

export default Balance
