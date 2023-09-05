import { Table } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (value, record) => {
        return (
          <Link to={`/setoran/cashier/${record.id}`}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</Link>
        )
      }
    },
    {
      title: 'Store Name',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
    />
  )
}

export default List
