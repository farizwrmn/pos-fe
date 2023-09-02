import { Table, Tag } from 'antd'
import { Link } from 'dva/router'

const List = ({
  location,
  handlePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100,
      render: (value, record) => {
        const { query } = location
        return <Link to={`/setoran/cashier/${record.balanceId}`} query={query}>{value}</Link>
      }
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      width: 100
    },
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName',
      width: 100
    },
    {
      title: 'Shift',
      dataIndex: 'shiftName',
      key: 'shiftName',
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 'pending' ? 'red' : 'green'} >{value === 'pending' ? 'Pending' : 'Completed'}</Tag></div>
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      onChange={handlePagination}
    />
  )
}

export default List
