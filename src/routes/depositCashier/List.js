import { Table } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'

const List = ({
  location,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (value, record) => {
        const { query } = location
        return (
          <Link to={`/setoran/cashier/detail/${record.id}`} query={query}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</Link>
        )
      }
    },
    {
      title: 'Balance Range Date',
      render: (_, record) => {
        console.log('record', record)
        return (
          <div>
            {moment(record.startDate, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(record.endDate, 'YYYY-MM-DD').format('DD MMM YYYY')}
          </div>
        )
      }
    },
    {
      title: 'Store Name',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Dibuat oleh',
      dataIndex: 'user.userName',
      key: 'user.userName'
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
